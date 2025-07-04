import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
    lang: "zh-CN",

    title: "阿卡不拉",
    description: "阿卡的文档",

    theme: defaultTheme({
        logo: "https://vuejs.press/images/hero.png",

        navbar: [
            {
                text: "Vue3",
                link: "/vue3/quick-start/02搭建工程.md",
            },
            {
                text: "阿卡的博客",
                link: "https://www.forclh.top",
            },
        ],

        sidebar: [
            {
                text: "Vue3",
                collapsible: false,
                children: [
                    {
                        text: "快速入门",
                        prefix: "/vue3/quick-start/",
                        collapsible: true,
                        children: [
                            "02搭建工程.md",
                            "03模板语法.md",
                            "04-05响应式基础.md",
                            "06响应式常用API.md",
                            "07计算属性.md",
                            "08类与样式绑定.md",
                            "09条件和列表渲染.md",
                            "10事件处理.md",
                            "11表单处理.md",
                            "13生命周期.md",
                            "14-15侦听器.md",
                            "18组件介绍.md",
                            "19Props.md",
                            "20自定义事件.md",
                            "21组件v-model.md",
                            "22插槽.md",
                            "24前端路由介绍.md",
                            "27KeepAlive内置组件.md",
                            "28状态管理库.md",
                            "30使用组件库.md",
                        ],
                    },

                    {
                        text: "深入本质",
                        prefix: "/vue3/go-deep/",
                        collapsible: true,
                        children: [
                            "02虚拟DOM本质.md",
                            "03模板的本质.md",
                            "04组件树和虚拟DOM树.md",
                            "05数据拦截的本质.md",
                            "06响应式数据的本质.md",
                            "07响应式的本质.md",
                            "08响应式和组件渲染.md",
                            "09实现响应式系统1.md",
                            "10实现响应式系统2.md",
                            "11图解EFFECT.md",
                            "12实现响应式系统3.md",
                            "13手写computed.md",
                            "14手写watch.md",
                            "15指令的本质.md",
                            "16插槽的本质.md",
                            "17v-model的本质.md",
                            "18setup语法语法标签.md",
                            "19组件生命周期.md",
                            "20keepalive生命周期.md",
                            "21keepalive的本质.md",
                            "22key的本质.md",
                        ],
                    },
                    {
                        text: "细节补充",
                        prefix: "/vue3/details/",
                        collapsible: true,
                        children: [
                            "02[Vue]属性透传.md",
                            "03[Vue]依赖注入.md",
                            "04[Vue]组合式函数.md",
                            "05[Vue]自定义指令.md",
                            "06[Vue]插件.md",
                            "07[Vue]Transition.md",
                            "08[Vue]TransitionGroup.md",
                            "09[Vue]Teleport.md",
                            "10[Vue]异步组件.md",
                            "11[Vue]Suspense.md",
                            "12[Router]路由模式.md",
                            "13[Router]路由零碎知识.md",
                            "14[Router]路由匹配语法.md",
                            "15[Router]路由组件传参.md",
                            "16[Router]内置组件和函数.md",
                            "17[Router]导航守卫.md",
                            "18[Router]过渡特效.md",
                            "19[Router]滚动行为.md",
                            "20[Router]动态路由.md",
                            "21[State]通信方式总结.md",
                            "22[State]Pinia自定义插件.md",
                            "23[场景]封装树形组件.md",
                            "24[场景]自定义ref实现防抖.md",
                            "25[场景]懒加载.md",
                            "26[场景]虚拟列表.md",
                            "27-28[场景]虚拟列表优化.md",
                            "29[第三方库]VueUse.md",
                            "30[第三方库]vuedraggable.md",
                            "31[第三方库]vue-drag-resize.md",
                            "32[第三方库]vue-chartjs.md",
                            "33[第三方库]vuelidate.md",
                            "34[第三方库]vue3-lazyload.md",
                            "35[场景]Websocket聊天室.md",
                            "36[vite]认识Vite.md",
                            "37[vite]配置文件.md",
                            "38[vite]依赖预构建.md",
                            "39[vite]构建生产版本.md",
                            "40[vite]环境变量与模式.md",
                            "41[vite]CLI.md",
                            "42[vite]Vite插件.md",
                        ],
                    },
                ],
            },
        ],
    }),

    bundler: viteBundler(),
});
