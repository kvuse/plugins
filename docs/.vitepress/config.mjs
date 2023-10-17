import { defineConfig } from 'vitepress';

import AutoSidebar from 'vitepress-auto-sidebar';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //       {
    //         text: 'guide',
    //         items: [
    //           { text: 'guide', link: '/guide' },
    //           {
    //             text: 'guide',
    //             items: [
    //               { text: 'api', link: '/api' },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    plugins: [
      AutoSidebar({
        dir: '/note',
        itemsTextMap: {
          component: '组件',
          note: '通知',
        },
      }),
    ],
  },
});
