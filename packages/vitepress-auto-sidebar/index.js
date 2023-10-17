// 自动生成侧边栏
import { path, chalk, fs } from 'zx';

let options = {};

/**
 * 获取Yaml数据
 * @param {string} markdown
 * @returns object
 */
function extractMetaData(markdown) {
  const regex = /^---\n(.|\n)*?---/m; // 匹配 YAML 头的正则表达式
  const match = markdown.match(regex); // 在 markdown 中查找匹配项

  if (!match) {
    return null; // 如果未找到匹配项，则返回 null
  }

  const metaData = match[0] // 获取匹配项
    .replace(/^---/, '') // 去除开头的 ---
    .replace(/\n---$/, '') // 去除结尾的 ---
    .trim() // 去除首尾的空格
    .split('\n') // 按换行符分割为数组
    .reduce((obj, line) => { // 将每一行转换为键值对
      const [key, value] = line.split(':').map((str) => str.trim());
      obj[key] = value;
      return obj;
    }, {});

  return metaData;
}

/**
 * 获取文件对象参数
 */
function getItemParams(files) {
  const { name, dir, base } = path.parse(files);
  const mdData = fs.readFileSync(path.join(process.cwd(), `${dir}/${base}`), 'utf-8');
  const metaData = extractMetaData(mdData);
  return {
    text: metaData?.title ?? name,
    link: `${dir}/${name}`,
    order: metaData?.order,
  };
}
const isMd = (file) => /.md$/.test(file);

// 数组排序
function sortSidebar(list) {
  const sortHandle = (a, b) => {
    if (!b.link && a.link) return -1;
    if (a.order && !b.order) return -1;
    if (!a.order && b.order) return 1;
    if (a.order && b.order) return a.order > b.order ? 1 : -1;
    return a.link > b.link;
  };
  list.sort((a, b) => sortHandle(a, b));
  list.forEach((item) => {
    if (Array.isArray(item.items)) {
      item.items.sort((a, b) => sortHandle(a, b));
    }
  });
  return list;
}
const isDir = (file) => fs.statSync(file).isDirectory();
const defaultIngoreList = ['node_modules', 'dist', 'coverage', '.vitepress'];

// 添加数组item
const addDirItem = (list, dir) => {
  const itemList = [];
  const docsPath = path.join(process.cwd(), dir);
  list.forEach((file) => {
    const filePath = path.join(docsPath, file);

    if (isDir(filePath)) {
      const params = {
        text: file,
        key: file,
        items: [],
      };

      fs.readdirSync(filePath).forEach((item) => {
        const itemPath = path.join(filePath, item);

        if (isMd(itemPath)) {
          params.items.push(getItemParams(`${dir}/${file}/${item}`));
        }

        if (isDir(itemPath)) {
          // addDirItem(fs.readdirSync(itemPath), `${dir}/${file}/${item}`, file);
        }
      });

      itemList.push(params);
    }

    if (isMd(filePath)) {
      const itembar = getItemParams(`${dir}/${file}`);
      itemList.push(itembar);
    }
  });

  return itemList;
};

const createSidebar = (dirPath) => {
  const { dir = '', ingoreDirList = [] } = options || {};
  const docsPath = path.join(process.cwd(), dirPath ?? dir);
  const files = fs.readdirSync(docsPath);
  const filterFiles = files.filter((file) => ![...defaultIngoreList, ...ingoreDirList].includes(file));
  const list = addDirItem(filterFiles, dirPath);
  return list;
};
/**
 * 获取文件夹下的文件列表
 * @param {object} config
 */
function getFilesList() {
  const { dir = '' } = options || {};
  const list = sortSidebar(createSidebar(dir));
  return list;
}

/**
 * 生成侧边栏
 * @param { object } options 插件参数
 * @param { object } config config参数
 */
async function generateSidebar(config) {
  return getFilesList(config);
}

export default function vitepressAutoSidebar(optConfig) {
  return {
    name: 'vitepressAutoSidebar',
    async config(config) {
      options = optConfig;
      const siderbar = await generateSidebar(config);
      config.vitepress.site.themeConfig.sidebar = siderbar;
      console.log(chalk.blue('[sidebar]'), chalk.green('insert sidebar data successfully'));
      return config;
    },
    configureServer(serve) {
      const mdWatcher = serve.watcher.add('*.md');
      mdWatcher.on('all', async (event) => {
        if (event !== 'change') {
          serve.restart();
          console.log(chalk.blue('[sidebar]'), chalk.green('update sidebar data successfully'));
        }
      });
    },
  };
}
