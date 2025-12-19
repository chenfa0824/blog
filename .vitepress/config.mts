import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "发发的文档库",
  description: "天道酬勤 厚积薄发",
  themeConfig: {
    nav: [
       { text: '技术学习', link: '/技术学习' },
          { text: '项目学习', link: '/项目学习' },
    {
    text: '测试人生',
    items: [

      { text: '功能测试', link: '/测试人生/功能测试' },
      { text: '接口测试', link: '/测试人生/接口测试' },
       { text: '性能测试', link: '/性能测试' },
       { text: '高可用测试', link: '/高可用测试' },
      { text: '安全测试', link: '/测试人生/安全测试' }
     ]},
      {
                    text: '组件测试',
                    items: [
                      { text: 'Redis', link: '/Redis/Redis' },
                      { text: 'Nacos', link: '/Nacos/Nacos' },
                      { text: 'Rocketmq', link: '/Rocketmq/Rocketmq' },
                      { text: 'Apollo', link: '/Apollo/Apollo' }
                    ]
                  },
            {
                          text: '面试经验',
                          items: [
                          { text: '个人简历', link: '/面试经验/个人简历' },
                          { text: '项目经验', link: '/面试经验/项目经验' },
                            { text: '面试经验1', link: '/面试经验/面试经验1' },
                            { text: '面试经验2', link: '/面试经验/面试经验2' }
                          ]
                        }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'test1', link: '/markdown-examples' },
          { text: 'test2', link: '/markdown-examples' },
          { text: 'test3', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
