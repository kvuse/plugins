# vitepress 自动生成侧边栏

## 安装

```bash
npm i vitepress-auto-sidebar -D

pnpm i vitepress-auto-sidebar -D
```

## 使用

```js
// .vitepress/config.js
import AutoSidebar from 'vitepress-auto-sidebar';
vite: {
  plugins: [
    AutoSidebar(),
  ],
}
```

## 参数说明

```json
{
  "dir": "", // 文件夹路径，默认/docs
  "ingoreDirList": [], //忽略的文件夹，默认['node_modules', 'dist', 'coverage']
  "itemsTextMap": {}, // 文件夹名称和侧边栏显示名称的映射关系，默认{'note': '首页'}
}
```

## 示例

```md
/docs
├─ .vitepress
│  └─ config.js
├─ api
│  ├─ about.md
│  ├─ collect.md
│  ├─ directives
│  │  ├─ focus.md
│  │  ├─ click.md
│  │  └─ ...
│  └─ ...
├─ utils
│  ├─ common.md
│  ├─ format-data.md
│  └─ ...
└─ ...

```

生成

```js
{
  '/api': [
    {
      text: 'about',
      link: '/api/about',
    },
    {
      text: 'collect',
      link: '/api/collect',
    },
    {
      text: 'directives',
      items: [{
        text: 'focus',
        link: '/api/directives/focus',
      },
      {
        text: 'click',
        link: '/api/directives/click',

      }],
    },
  ],
  '/utils': [
    {
      text: 'common',
      link: '/utils/common',
    },
    {
      text: 'format-data',
      link: '/utils/format-data',
    },
  ],
}
```

可设置`itemsTextMap: { directives:'自定义指令'}`，

设置`text: 'directives'`，侧边栏显示为`自定义指令`
