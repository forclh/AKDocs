import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "阿卡不拉",
  description: "阿卡的文档库",
  head: [
    ["meta", { name: "author", content: "阿卡" }],
    ["meta", { name: "keywords", content: "前端,Vue3,JavaScript,面试,文档" }],
    ["meta", { property: "og:site_name", content: "阿卡不拉" }],
    ["meta", { property: "og:title", content: "阿卡不拉" }],
    ["meta", { property: "og:description", content: "阿卡的文档" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    // 网站图标
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  ],
  themeConfig: {
    logo: "https://bu.dusays.com/2025/11/26/69266a4e6508c.png",
    nav: [
      { text: "面试核心", link: "/interview/面试核心.md" },
      { text: "阿卡的博客", link: "https://www.forclh.top" },
    ],
    sidebar: [
      {
        text: "学习笔记",
        collapsed: false,
        items: [
          {
            text: "HTML",
            collapsed: true,
            items: [
              {
                text: "HTML基础",
                collapsed: true,
                items: [],
              },
              {
                text: "HTML进阶",
                collapsed: true,
                items: [
                  {
                    text: "iframe元素",
                    link: "/notes/html/advance/01iframe元素.md",
                  },
                  {
                    text: "表单元素",
                    link: "/notes/html/advance/02表单元素.md",
                  },
                  {
                    text: "美化表单元素",
                    link: "/notes/html/advance/03美化表单元素.md",
                  },
                  {
                    text: "表单练习",
                    link: "/notes/html/advance/04表单练习.md",
                  },
                  {
                    text: "表格元素",
                    link: "/notes/html/advance/05表格元素.md",
                  },
                  {
                    text: "其他元素",
                    link: "/notes/html/advance/06其他元素.md",
                  },
                ],
              },
            ],
          },
          {
            text: "CSS",
            collapsed: true,
            items: [
              {
                text: "CSS基础",
                collapsed: true,
                items: [
                  {
                    text: "为网页添加样式",
                    link: "/notes/css/base/01为网页添加样式.md",
                  },
                  {
                    text: "常见样式声明",
                    link: "/notes/css/base/02常见样式声明.md",
                  },
                  { text: "选择器", link: "/notes/css/base/03选择器.md" },
                  { text: "层叠", link: "/notes/css/base/04层叠.md" },
                  { text: "继承", link: "/notes/css/base/05继承.md" },
                  {
                    text: "属性值的计算过程",
                    link: "/notes/css/base/06属性值的计算过程.md",
                  },
                  { text: "盒模型", link: "/notes/css/base/07盒模型.md" },
                  {
                    text: "盒模型应用",
                    link: "/notes/css/base/08盒模型应用.md",
                  },
                  {
                    text: "行盒的盒模型",
                    link: "/notes/css/base/09行盒的盒模型.md",
                  },
                  { text: "常规流", link: "/notes/css/base/10常规流.md" },
                  { text: "浮动", link: "/notes/css/base/11浮动.md" },
                  { text: "定位", link: "/notes/css/base/12定位.md" },
                  {
                    text: "更多的选择器",
                    link: "/notes/css/base/13更多的选择器.md",
                  },
                  {
                    text: "更多的样式",
                    link: "/notes/css/base/14更多的样式.md",
                  },
                ],
              },
              {
                text: "CSS进阶",
                collapsed: true,
                items: [
                  { text: "@规则", link: "/notes/css/advance/01@规则.md" },
                  {
                    text: "web字体和图标",
                    link: "/notes/css/advance/02web字体和图标.md",
                  },
                  {
                    text: "块级格式化上下文",
                    link: "/notes/css/advance/03块级格式化上下文.md",
                  },
                  { text: "布局", link: "/notes/css/advance/04布局.md" },
                  {
                    text: "浮动的细节规则",
                    link: "/notes/css/advance/05浮动的细节规则.md",
                  },
                  {
                    text: "行高的取值",
                    link: "/notes/css/advance/06行高的取值.md",
                  },
                  {
                    text: "body背景",
                    link: "/notes/css/advance/07body背景.md",
                  },
                  {
                    text: "行盒的垂直对齐",
                    link: "/notes/css/advance/08行盒的垂直对齐.md",
                  },
                  {
                    text: "深入理解字体",
                    link: "/notes/css/advance/09深入理解字体.md",
                  },
                  {
                    text: "堆叠上下文",
                    link: "/notes/css/advance/10堆叠上下文.md",
                  },
                  { text: "svg", link: "/notes/css/advance/11svg.md" },
                  {
                    text: "数据链接",
                    link: "/notes/css/advance/12数据链接.md",
                  },
                  {
                    text: "浏览器兼容性",
                    link: "/notes/css/advance/13浏览器兼容性.md",
                  },
                  {
                    text: "居中总结",
                    link: "/notes/css/advance/14居中总结.md",
                  },
                  {
                    text: "样式补充",
                    link: "/notes/css/advance/15样式补充.md",
                  },
                ],
              },
              {
                text: "CSS3",
                collapsed: true,
                items: [
                  { text: "渐变", link: "/notes/css/css3/03渐变.md" },
                  {
                    text: "Transform",
                    link: "/notes/css/css3/04Transform.md",
                  },
                  {
                    text: "Transition",
                    link: "/notes/css/css3/05Transition.md",
                  },
                  { text: "Flex布局", link: "/notes/css/css3/07Flex布局.md" },
                  { text: "Grid布局", link: "/notes/css/css3/08Grid布局.md" },
                ],
              },
            ],
          },
          {
            text: "ES6+",
            collapsed: true,
            items: [
              {
                text: "反射与代理-属性描述符",
                link: "/notes/es6+/12反射与代理-属性描述符.md",
              },
              {
                text: "反射与代理-Reflect",
                link: "/notes/es6+/12反射与代理-Reflect.md",
              },
              {
                text: "反射与代理-Proxy",
                link: "/notes/es6+/12反射与代理-Proxy.md",
              },
              {
                text: "反射与代理-观察者模式",
                link: "/notes/es6+/12反射与代理-观察者模式.md",
              },
              {
                text: "反射与代理-偷懒的构造函数",
                link: "/notes/es6+/12反射与代理-偷懒的构造函数.md",
              },
              {
                text: "反射与代理-可验证的函数参数",
                link: "/notes/es6+/12反射与代理-可验证的函数参数.md",
              },
            ],
          },
          {
            text: "Vue3",
            collapsed: true,
            items: [
              {
                text: "快速入门",
                collapsed: true,
                items: [
                  {
                    text: "搭建工程",
                    link: "/notes/vue3/quick-start/02搭建工程.md",
                  },
                  {
                    text: "模板语法",
                    link: "/notes/vue3/quick-start/03模板语法.md",
                  },
                  {
                    text: "响应式基础",
                    link: "/notes/vue3/quick-start/04-05响应式基础.md",
                  },
                  {
                    text: "响应式常用API",
                    link: "/notes/vue3/quick-start/06响应式常用API.md",
                  },
                  {
                    text: "计算属性",
                    link: "/notes/vue3/quick-start/07计算属性.md",
                  },
                  {
                    text: "类与样式绑定",
                    link: "/notes/vue3/quick-start/08类与样式绑定.md",
                  },
                  {
                    text: "条件和列表渲染",
                    link: "/notes/vue3/quick-start/09条件和列表渲染.md",
                  },
                  {
                    text: "事件处理",
                    link: "/notes/vue3/quick-start/10事件处理.md",
                  },
                  {
                    text: "表单处理",
                    link: "/notes/vue3/quick-start/11表单处理.md",
                  },
                  {
                    text: "生命周期",
                    link: "/notes/vue3/quick-start/13生命周期.md",
                  },
                  {
                    text: "侦听器",
                    link: "/notes/vue3/quick-start/14-15侦听器.md",
                  },
                  {
                    text: "组件介绍",
                    link: "/notes/vue3/quick-start/18组件介绍.md",
                  },
                  {
                    text: "Props",
                    link: "/notes/vue3/quick-start/19Props.md",
                  },
                  {
                    text: "自定义事件",
                    link: "/notes/vue3/quick-start/20自定义事件.md",
                  },
                  {
                    text: "组件v-model",
                    link: "/notes/vue3/quick-start/21组件v-model.md",
                  },
                  { text: "插槽", link: "/notes/vue3/quick-start/22插槽.md" },
                  {
                    text: "前端路由介绍",
                    link: "/notes/vue3/quick-start/24前端路由介绍.md",
                  },
                  {
                    text: "KeepAlive内置组件",
                    link: "/notes/vue3/quick-start/27KeepAlive内置组件.md",
                  },
                  {
                    text: "状态管理库",
                    link: "/notes/vue3/quick-start/28状态管理库.md",
                  },
                  {
                    text: "使用组件库",
                    link: "/notes/vue3/quick-start/30使用组件库.md",
                  },
                ],
              },
              {
                text: "深入本质",
                collapsed: true,
                items: [
                  {
                    text: "虚拟DOM本质",
                    link: "/notes/vue3/go-deep/02虚拟DOM本质.md",
                  },
                  {
                    text: "模板的本质",
                    link: "/notes/vue3/go-deep/03模板的本质.md",
                  },
                  {
                    text: "组件树和虚拟DOM树",
                    link: "/notes/vue3/go-deep/04组件树和虚拟DOM树.md",
                  },
                  {
                    text: "数据拦截的本质",
                    link: "/notes/vue3/go-deep/05数据拦截的本质.md",
                  },
                  {
                    text: "响应式数据的本质",
                    link: "/notes/vue3/go-deep/06响应式数据的本质.md",
                  },
                  {
                    text: "响应式的本质",
                    link: "/notes/vue3/go-deep/07响应式的本质.md",
                  },
                  {
                    text: "响应式和组件渲染",
                    link: "/notes/vue3/go-deep/08响应式和组件渲染.md",
                  },
                  {
                    text: "实现响应式系统1",
                    link: "/notes/vue3/go-deep/09实现响应式系统1.md",
                  },
                  {
                    text: "实现响应式系统2",
                    link: "/notes/vue3/go-deep/10实现响应式系统2.md",
                  },
                  {
                    text: "图解EFFECT",
                    link: "/notes/vue3/go-deep/11图解EFFECT.md",
                  },
                  {
                    text: "实现响应式系统3",
                    link: "/notes/vue3/go-deep/12实现响应式系统3.md",
                  },
                  {
                    text: "手写computed",
                    link: "/notes/vue3/go-deep/13手写computed.md",
                  },
                  {
                    text: "手写watch",
                    link: "/notes/vue3/go-deep/14手写watch.md",
                  },
                  {
                    text: "指令的本质",
                    link: "/notes/vue3/go-deep/15指令的本质.md",
                  },
                  {
                    text: "插槽的本质",
                    link: "/notes/vue3/go-deep/16插槽的本质.md",
                  },
                  {
                    text: "v-model的本质",
                    link: "/notes/vue3/go-deep/17v-model的本质.md",
                  },
                  {
                    text: "setup语法标签",
                    link: "/notes/vue3/go-deep/18setup语法标签.md",
                  },
                  {
                    text: "组件生命周期",
                    link: "/notes/vue3/go-deep/19组件生命周期.md",
                  },
                  {
                    text: "keepalive生命周期",
                    link: "/notes/vue3/go-deep/20keepalive生命周期.md",
                  },
                  {
                    text: "keepalive的本质",
                    link: "/notes/vue3/go-deep/21keepalive的本质.md",
                  },
                  {
                    text: "key的本质",
                    link: "/notes/vue3/go-deep/22key的本质.md",
                  },
                ],
              },
              {
                text: "细节补充",
                collapsed: true,
                items: [
                  {
                    text: "[Vue]属性透传",
                    link: "/notes/vue3/details/02Vue-属性透传.md",
                  },
                  {
                    text: "[Vue]依赖注入",
                    link: "/notes/vue3/details/03Vue-依赖注入.md",
                  },
                  {
                    text: "[Vue]组合式函数",
                    link: "/notes/vue3/details/04Vue-组合式函数.md",
                  },
                  {
                    text: "[Vue]自定义指令",
                    link: "/notes/vue3/details/05Vue-自定义指令.md",
                  },
                  {
                    text: "[Vue]插件",
                    link: "/notes/vue3/details/06Vue-插件.md",
                  },
                  {
                    text: "[Vue]Transition",
                    link: "/notes/vue3/details/07Vue-Transition.md",
                  },
                  {
                    text: "[Vue]TransitionGroup",
                    link: "/notes/vue3/details/08Vue-TransitionGroup.md",
                  },
                  {
                    text: "[Vue]Teleport",
                    link: "/notes/vue3/details/09Vue-Teleport.md",
                  },
                  {
                    text: "[Vue]异步组件",
                    link: "/notes/vue3/details/10Vue-异步组件.md",
                  },
                  {
                    text: "[Vue]Suspense",
                    link: "/notes/vue3/details/11Vue-Suspense.md",
                  },
                  {
                    text: "[Router]路由模式",
                    link: "/notes/vue3/details/12Router-路由模式.md",
                  },
                  {
                    text: "[Router]路由零碎知识",
                    link: "/notes/vue3/details/13Router-路由零碎知识.md",
                  },
                  {
                    text: "[Router]路由匹配语法",
                    link: "/notes/vue3/details/14Router-路由匹配语法.md",
                  },
                  {
                    text: "[Router]路由组件传参",
                    link: "/notes/vue3/details/15Router-路由组件传参.md",
                  },
                  {
                    text: "[Router]内置组件和函数",
                    link: "/notes/vue3/details/16Router-内置组件和函数.md",
                  },
                  {
                    text: "[Router]导航守卫",
                    link: "/notes/vue3/details/17Router-导航守卫.md",
                  },
                  {
                    text: "[Router]过渡特效",
                    link: "/notes/vue3/details/18Router-过渡特效.md",
                  },
                  {
                    text: "[Router]滚动行为",
                    link: "/notes/vue3/details/19Router-滚动行为.md",
                  },
                  {
                    text: "[Router]动态路由",
                    link: "/notes/vue3/details/20Router-动态路由.md",
                  },
                  {
                    text: "[State]通信方式总结",
                    link: "/notes/vue3/details/21State-通信方式总结.md",
                  },
                  {
                    text: "[State]Pinia自定义插件",
                    link: "/notes/vue3/details/22State-Pinia自定义插件.md",
                  },
                  {
                    text: "[场景]封装树形组件",
                    link: "/notes/vue3/details/23场景-封装树形组件.md",
                  },
                  {
                    text: "[场景]自定义ref实现防抖",
                    link: "/notes/vue3/details/24场景-自定义ref实现防抖.md",
                  },
                  {
                    text: "[场景]懒加载",
                    link: "/notes/vue3/details/25场景-懒加载.md",
                  },
                  {
                    text: "[场景]虚拟列表",
                    link: "/notes/vue3/details/26场景-虚拟列表.md",
                  },
                  {
                    text: "[场景]虚拟列表优化",
                    link: "/notes/vue3/details/27-28场景-虚拟列表优化.md",
                  },
                  {
                    text: "[第三方库]VueUse",
                    link: "/notes/vue3/details/29第三方库-VueUse.md",
                  },
                  {
                    text: "[第三方库]vuedraggable",
                    link: "/notes/vue3/details/30第三方库-vuedraggable.md",
                  },
                  {
                    text: "[第三方库]vue-drag-resize",
                    link: "/notes/vue3/details/31第三方库-vue-drag-resize.md",
                  },
                  {
                    text: "[第三方库]vue-chartjs",
                    link: "/notes/vue3/details/32第三方库-vue-chartjs.md",
                  },
                  {
                    text: "[第三方库]vuelidate",
                    link: "/notes/vue3/details/33第三方库-vuelidate.md",
                  },
                  {
                    text: "[第三方库]vue3-lazyload",
                    link: "/notes/vue3/details/34第三方库-vue3-lazyload.md",
                  },
                  {
                    text: "[场景]Websocket聊天室",
                    link: "/notes/vue3/details/35场景-Websocket聊天室.md",
                  },
                  {
                    text: "[vite]认识Vite",
                    link: "/notes/vue3/details/36vite-认识Vite.md",
                  },
                  {
                    text: "[vite]配置文件",
                    link: "/notes/vue3/details/37vite-配置文件.md",
                  },
                  {
                    text: "[vite]依赖预构建",
                    link: "/notes/vue3/details/38vite-依赖预构建.md",
                  },
                  {
                    text: "[vite]构建生产版本",
                    link: "/notes/vue3/details/39vite-构建生产版本.md",
                  },
                  {
                    text: "[vite]环境变量与模式",
                    link: "/notes/vue3/details/40vite-环境变量与模式.md",
                  },
                  {
                    text: "[vite]CLI",
                    link: "/notes/vue3/details/41vite-CLI.md",
                  },
                  {
                    text: "[vite]Vite插件",
                    link: "/notes/vue3/details/42vite-Vite插件.md",
                  },
                ],
              },
            ],
          },
          {
            text: "TS",
            collapsed: true,
            items: [
              {
                text: "快速入门",
                collapsed: true,
                items: [
                  {
                    text: "Playground",
                    link: "/notes/ts/01quick-start/01Playground.md",
                  },
                  {
                    text: "安装与运行",
                    link: "/notes/ts/01quick-start/02安装与运行.md",
                  },
                  {
                    text: "开发相关配置",
                    link: "/notes/ts/01quick-start/03开发相关配置.md",
                  },
                  {
                    text: "TS常见类型",
                    link: "/notes/ts/01quick-start/04TS常见类型.md",
                  },
                  {
                    text: "类型声明",
                    link: "/notes/ts/01quick-start/05类型声明.md",
                  },
                ],
              },
              {
                text: "类型理解",
                collapsed: true,
                items: [
                  {
                    text: "一切从类型的理解开始",
                    link: "/notes/ts/02type-understanding/01一切从类型的理解开始.md",
                  },
                  {
                    text: "any与unknown",
                    link: "/notes/ts/02type-understanding/02any与unknown.md",
                  },
                  {
                    text: "boolean与类型字面量",
                    link: "/notes/ts/02type-understanding/03boolean与类型字面量.md",
                  },
                  {
                    text: "number,bigint与string",
                    link: "/notes/ts/02type-understanding/04number,bigint与string.md",
                  },
                  {
                    text: "symbol",
                    link: "/notes/ts/02type-understanding/05symbol.md",
                  },
                  {
                    text: "类型拓宽",
                    link: "/notes/ts/02type-understanding/06类型拓宽.md",
                  },
                  {
                    text: "null与undefined",
                    link: "/notes/ts/02type-understanding/07null与undefined.md",
                  },
                  {
                    text: "void",
                    link: "/notes/ts/02type-understanding/08void.md",
                  },
                  {
                    text: "对象字面量",
                    link: "/notes/ts/02type-understanding/09对象字面量.md",
                  },
                  {
                    text: "类型别名与接口",
                    link: "/notes/ts/02type-understanding/10类型别名与接口.md",
                  },
                  {
                    text: "结构化类型",
                    link: "/notes/ts/02type-understanding/11结构化类型.md",
                  },
                  {
                    text: "装箱与拆箱类型",
                    link: "/notes/ts/02type-understanding/12装箱与拆箱类型.md",
                  },
                  {
                    text: "联合类型",
                    link: "/notes/ts/02type-understanding/13联合类型.md",
                  },
                  {
                    text: "交叉类型",
                    link: "/notes/ts/02type-understanding/14交叉类型.md",
                  },
                  {
                    text: "typeof与控制流分析",
                    link: "/notes/ts/02type-understanding/15typeof与控制流分析.md",
                  },
                  {
                    text: "instanceof与in",
                    link: "/notes/ts/02type-understanding/16instanceof与in.md",
                  },
                  {
                    text: "字面量类型检查",
                    link: "/notes/ts/02type-understanding/17字面量类型检查.md",
                  },
                  {
                    text: "自定义守卫",
                    link: "/notes/ts/02type-understanding/18自定义守卫.md",
                  },
                  {
                    text: "never",
                    link: "/notes/ts/02type-understanding/19never.md",
                  },
                  {
                    text: "数组与元组",
                    link: "/notes/ts/02type-understanding/20数组与元组.md",
                  },
                  {
                    text: "方括号运算符",
                    link: "/notes/ts/02type-understanding/21方括号运算符.md",
                  },
                  {
                    text: "类型断言",
                    link: "/notes/ts/02type-understanding/22类型断言.md",
                  },
                  {
                    text: "satisfies",
                    link: "/notes/ts/02type-understanding/23satisfies.md",
                  },
                  {
                    text: "枚举",
                    link: "/notes/ts/02type-understanding/24枚举.md",
                  },
                ],
              },
              {
                text: "函数与泛型",
                collapsed: true,
                items: [
                  {
                    text: "函数的声明与调用",
                    link: "/notes/ts/03functions-and-generics/01函数的声明与调用.md",
                  },
                  {
                    text: "调用签名",
                    link: "/notes/ts/03functions-and-generics/02调用签名.md",
                  },
                  {
                    text: "重载",
                    link: "/notes/ts/03functions-and-generics/03重载.md",
                  },
                  {
                    text: "理解泛型",
                    link: "/notes/ts/03functions-and-generics/04理解泛型.md",
                  },
                  {
                    text: "类型别名与接口使用泛型",
                    link: "/notes/ts/03functions-and-generics/05类型别名与接口使用泛型.md",
                  },
                  {
                    text: "多泛型",
                    link: "/notes/ts/03functions-and-generics/06多泛型.md",
                  },
                  {
                    text: "泛型的默认类型",
                    link: "/notes/ts/03functions-and-generics/07泛型的默认类型.md",
                  },
                  {
                    text: "受限的泛型",
                    link: "/notes/ts/03functions-and-generics/08受限的泛型.md",
                  },
                  {
                    text: "类型理解再升级-型变",
                    link: "/notes/ts/03functions-and-generics/09类型理解再升级-型变.md",
                  },
                  {
                    text: "多余属性检查",
                    link: "/notes/ts/03functions-and-generics/10多余属性检查.md",
                  },
                  {
                    text: "逆变",
                    link: "/notes/ts/03functions-and-generics/11逆变.md",
                  },
                ],
              },
            ],
          },
          {
            text: "第三方库",
            collapsed: true,
            items: [
              {
                text: "常用第三方工具库",
                link: "/notes/lib/00常用第三方工具库.md",
              },
              { text: "JQuery", link: "/notes/lib/01JQuery.md" },
              { text: "Lodash", link: "/notes/lib/02Lodash.md" },
              { text: "Animate.css", link: "/notes/lib/03Animate.css.md" },
              { text: "Axios", link: "/notes/lib/04Axios.md" },
              { text: "MockJS", link: "/notes/lib/05MockJS.md" },
              { text: "Moment", link: "/notes/lib/06Moment.md" },
              { text: "ECharts", link: "/notes/lib/07ECharts.md" },
            ],
          },
          {
            text: "工具",
            collapsed: true,
            items: [{ text: "Git", link: "/notes/tools/01Git.md" }],
          },
          {
            text: "其他知识点",
            collapsed: true,
            items: [
              {
                text: "前端项目打包流程与编译概念详解",
                link: "/notes/other/01前端项目打包流程与编译概念详解.md",
              },
              {
                text: "前端路由的核心原理",
                link: "/notes/other/03前端路由的核心原理.md",
              },
              {
                text: "Pinia核心原理",
                link: "/notes/other/04Pinia核心原理.md",
              },
              { text: "位运算", link: "/notes/other/05位运算.md" },
            ],
          },
        ],
      },
      {
        text: "笔面试题",
        collapsed: false,
        items: [
          {
            text: "HTML",
            collapsed: true,
            items: [
              {
                text: "HTML面试题汇总",
                link: "/interview/html/00HTML面试题汇总.md",
              },
              { text: "文档声明", link: "/interview/html/01文档声明.md" },
              { text: "语义化", link: "/interview/html/02语义化.md" },
              {
                text: "W3C标准组织",
                link: "/interview/html/03W3C标准组织.md",
              },
              { text: "SEO", link: "/interview/html/04SEO.md" },
              { text: "iframe", link: "/interview/html/05iframe.md" },
              { text: "微格式", link: "/interview/html/06微格式.md" },
              { text: "替换元素", link: "/interview/html/07替换元素.md" },
              { text: "页面可见性", link: "/interview/html/08页面可见性.md" },
            ],
          },
          {
            text: "CSS",
            collapsed: true,
            items: [
              {
                text: "CSS 面试题汇总",
                link: "/interview/css/00CSS面试题汇总.md",
              },
              {
                text: "CSS单位总结",
                link: "/interview/css/01CSS单位总结.md",
              },
              {
                text: "居中方式总结",
                link: "/interview/css/02居中方式总结.md",
              },
              {
                text: "隐藏元素方式总结",
                link: "/interview/css/03隐藏元素方式总结.md",
              },
              { text: "浮动", link: "/interview/css/04浮动.md" },
              { text: "定位总结", link: "/interview/css/05定位总结.md" },
              { text: "BFC", link: "/interview/css/06BFC.md" },
              {
                text: "CSS属性计算过程",
                link: "/interview/css/07CSS属性计算过程.md",
              },
              {
                text: "CSS层叠继承规则总结",
                link: "/interview/css/08CSS层叠继承规则总结.md",
              },
              { text: "import指令", link: "/interview/css/09import指令.md" },
              {
                text: "CSS3的calc函数",
                link: "/interview/css/10CSS3的calc函数.md",
              },
              {
                text: "CSS3的媒体查询",
                link: "/interview/css/11CSS3的媒体查询.md",
              },
              {
                text: "过渡和动画事件",
                link: "/interview/css/12过渡和动画事件.md",
              },
              {
                text: "渐进增强和优雅降级",
                link: "/interview/css/13渐进增强和优雅降级.md",
              },
              { text: "CSS3变形", link: "/interview/css/14CSS3变形.md" },
              { text: "渐进式渲染", link: "/interview/css/15渐进式渲染.md" },
              {
                text: "CSS渲染性能优化",
                link: "/interview/css/16CSS渲染性能优化.md",
              },
              { text: "层叠上下文", link: "/interview/css/17层叠上下文.md" },
              { text: "CSS3遮罩", link: "/interview/css/18CSS3遮罩.md" },
            ],
          },
          {
            text: "JavaScript",
            collapsed: true,
            items: [
              {
                text: "js面试题汇总",
                link: "/interview/js/00js面试题汇总.md",
              },
              {
                text: "let、var、const的区别",
                link: "/interview/js/01let、var、const的区别.md",
              },
              { text: "数据类型", link: "/interview/js/02数据类型.md" },
              { text: "包装类型", link: "/interview/js/03包装类型.md" },
              {
                text: "数据类型的转换",
                link: "/interview/js/04数据类型的转换.md",
              },
              { text: "运算符", link: "/interview/js/05运算符.md" },
              { text: "原型链", link: "/interview/js/06原型链.md" },
              { text: "this指向", link: "/interview/js/07this指向.md" },
              {
                text: "垃圾回收与内存泄漏",
                link: "/interview/js/08垃圾回收与内存泄漏.md",
              },
              {
                text: "执行栈和执行上下文",
                link: "/interview/js/09执行栈和执行上下文.md",
              },
              {
                text: "作用域和作用域链",
                link: "/interview/js/10作用域和作用域链.md",
              },
              { text: "闭包", link: "/interview/js/11闭包.md" },
              {
                text: "DOM 事件的注册和移除",
                link: "/interview/js/12DOM事件的注册和移除.md",
              },
              {
                text: "DOM 事件的传播机制",
                link: "/interview/js/13DOM事件的传播机制.md",
              },
              {
                text: "阻止事件默认行为",
                link: "/interview/js/14阻止事件默认行为.md",
              },
              { text: "递归", link: "/interview/js/15递归.md" },
              { text: "属性描述符", link: "/interview/js/16属性描述符.md" },
              {
                text: "class和构造函数区别",
                link: "/interview/js/17class和构造函数区别.md",
              },
              {
                text: "浮点数精度问题",
                link: "/interview/js/18浮点数精度问题.md",
              },
              { text: "严格模式", link: "/interview/js/19严格模式.md" },
              {
                text: "函数防抖和节流",
                link: "/interview/js/20函数防抖和节流.md",
              },
              {
                text: "WeakSet和WeakMap",
                link: "/interview/js/21WeakSet和WeakMap.md",
              },
              { text: "深浅拷贝", link: "/interview/js/22深浅拷贝.md" },
              { text: "函数柯里化", link: "/interview/js/23函数柯里化.md" },
              {
                text: "Node的事件循环",
                link: "/interview/js/24Node的事件循环.md",
              },
              { text: "尺寸和位置", link: "/interview/js/25尺寸和位置.md" },
              { text: "事件循环", link: "/interview/js/26事件循环.md" },
            ],
          },
          {
            text: "Promise",
            collapsed: true,
            items: [
              {
                text: "Promise面试题汇总",
                link: "/interview/promise/00Promise面试题汇总.md",
              },
              {
                text: "Promise基础",
                link: "/interview/promise/01Promise基础.md",
              },
              {
                text: "Promise的链式调用",
                link: "/interview/promise/02Promise的链式调用.md",
              },
              {
                text: "Promise的静态方法",
                link: "/interview/promise/03Promise的静态方法.md",
              },
              {
                text: "async和await",
                link: "/interview/promise/04async和await.md",
              },
            ],
          },
          {
            text: "浏览器",
            collapsed: true,
            items: [
              {
                text: "浏览器面试题汇总",
                link: "/interview/browser/00浏览器面试题汇总.md",
              },
              {
                text: "浏览器的渲染流程",
                link: "/interview/browser/01浏览器的渲染流程.md",
              },
              {
                text: "资源提示关键词",
                link: "/interview/browser/02资源提示关键词.md",
              },
              {
                text: "浏览器的组成部分",
                link: "/interview/browser/03浏览器的组成部分.md",
              },
              {
                text: "IndexedDB",
                link: "/interview/browser/04IndexedDB.md",
              },
              { text: "File API", link: "/interview/browser/05FileAPI.md" },
              {
                text: "浏览器缓存",
                link: "/interview/browser/06浏览器缓存.md",
              },
              {
                text: "跨标签页通信",
                link: "/interview/browser/07跨标签页通信.md",
              },
              {
                text: "WebWorker",
                link: "/interview/browser/08WebWorker.md",
              },
            ],
          },
          {
            text: "网络",
            collapsed: true,
            items: [
              {
                text: "网络面试题汇总",
                link: "/interview/network/00网络面试题汇总.md",
              },
              {
                text: "五层网络模型",
                link: "/interview/network/01五层网络模型.md",
              },
              {
                text: "常见请求方法",
                link: "/interview/network/02常见请求方法.md",
              },
              { text: "cookie", link: "/interview/network/03cookie.md" },
              {
                text: "cookie和storage",
                link: "/interview/network/04cookie和storage.md",
              },
              { text: "加密", link: "/interview/network/05加密.md" },
              { text: "jwt", link: "/interview/network/06jwt.md" },
              {
                text: "同源策略及跨域解决方案",
                link: "/interview/network/07同源策略及跨域解决方案.md",
              },
              { text: "文件上传", link: "/interview/network/08文件上传.md" },
              {
                text: "输入url地址之后",
                link: "/interview/network/09输入url地址之后.md",
              },
              { text: "文件下载", link: "/interview/network/10文件下载.md" },
              { text: "session", link: "/interview/network/11session.md" },
              { text: "TCP协议", link: "/interview/network/13TCP协议.md" },
              { text: "CSRF", link: "/interview/network/14CSRF.md" },
              { text: "XSS攻击", link: "/interview/network/15XSS攻击.md" },
              {
                text: "网络性能优化",
                link: "/interview/network/16网络性能优化.md",
              },
              { text: "断点续传", link: "/interview/network/17断点续传.md" },
              {
                text: "域名和DNS",
                link: "/interview/network/18域名和DNS.md",
              },
              { text: "HTTPS", link: "/interview/network/19HTTPS.md" },
              {
                text: "HTTP各版本差异",
                link: "/interview/network/20HTTP各版本差异.md",
              },
              {
                text: "HTTP缓存协议",
                link: "/interview/network/20HTTP缓存协议.md",
              },
              {
                text: "WebSocket",
                link: "/interview/network/21WebSocket.md",
              },
            ],
          },
          {
            text: "工程化",
            collapsed: true,
            items: [
              {
                text: "CMJ和ESM",
                link: "/interview/engineering/01CMJ和ESM.md",
              },
              { text: "npx", link: "/interview/engineering/02npx.md" },
              { text: "ESLint", link: "/interview/engineering/03ESLint.md" },
            ],
          },
          {
            text: "Vue2",
            collapsed: true,
            items: [
              {
                text: "vue2笔面试题汇总",
                link: "/interview/vue2/00vue2笔面试题汇总.md",
              },
              {
                text: "组件通信总结",
                link: "/interview/vue2/01组件通信总结.md",
              },
              { text: "虚拟DOM", link: "/interview/vue2/02虚拟DOM.md" },
              { text: "v-model", link: "/interview/vue2/03v-model.md" },
              {
                text: "数据响应原理",
                link: "/interview/vue2/04数据响应原理.md",
              },
              { text: "diff", link: "/interview/vue2/05diff.md" },
              {
                text: "生命周期详解",
                link: "/interview/vue2/06生命周期详解.md",
              },
              { text: "computed", link: "/interview/vue2/07computed.md" },
              { text: "过滤器", link: "/interview/vue2/08过滤器.md" },
              { text: "作用域插槽", link: "/interview/vue2/09作用域插槽.md" },
              { text: "过渡和动画", link: "/interview/vue2/10过渡和动画.md" },
              { text: "优化", link: "/interview/vue2/11优化.md" },
              { text: "keep-alive", link: "/interview/vue2/12keep-alive.md" },
              { text: "长列表优化", link: "/interview/vue2/13长列表优化.md" },
              { text: "其他API", link: "/interview/vue2/14其他API.md" },
              {
                text: "模式和环境变量",
                link: "/interview/vue2/15模式和环境变量.md",
              },
              { text: "更多配置", link: "/interview/vue2/16更多配置.md" },
              { text: "更多命令", link: "/interview/vue2/17更多命令.md" },
              { text: "嵌套路由", link: "/interview/vue2/18嵌套路由.md" },
              {
                text: "路由切换动画",
                link: "/interview/vue2/19路由切换动画.md",
              },
            ],
          },
          {
            text: "Vue3",
            collapsed: true,
            items: [
              {
                text: "Vue3整体变化",
                link: "/interview/vue3/01Vue3整体变化.md",
              },
              {
                text: "Vue3响应式变化",
                link: "/interview/vue3/02Vue3响应式变化.md",
              },
              {
                text: "nextTick实现原理",
                link: "/interview/vue3/03nextTick实现原理.md",
              },
              { text: "两道代码题", link: "/interview/vue3/04两道代码题.md" },
              {
                text: "Vue运行机制",
                link: "/interview/vue3/05Vue运行机制.md",
              },
              {
                text: "渲染器核心功能",
                link: "/interview/vue3/06渲染器核心功能.md",
              },
              {
                text: "事件绑定与更新",
                link: "/interview/vue3/07事件绑定与更新.md",
              },
            ],
          },
          {
            text: "性能优化",
            collapsed: true,
            items: [
              {
                text: "核心web指标",
                link: "/interview/optimization/01核心web指标.md",
              },
              {
                text: "线上页面卡顿",
                link: "/interview/optimization/02线上页面卡顿.md",
              },
              {
                text: "优化script标签",
                link: "/interview/optimization/03优化script标签.md",
              },
              {
                text: "资源提示符优化性能",
                link: "/interview/optimization/04资源提示符优化性能.md",
              },
              {
                text: "HTTP缓存和ServiceWorker该如何选择",
                link: "/interview/optimization/05HTTP缓存和ServiceWorker该如何选择.md",
              },
              {
                text: "如何用CDN提升网站加载速度",
                link: "/interview/optimization/06如何用CDN提升网站加载速度.md",
              },
              {
                text: "如何对网站的图片资源进行优化",
                link: "/interview/optimization/07如何对网站的图片资源进行优化.md",
              },
              {
                text: "如何加载大量图标",
                link: "/interview/optimization/08如何加载大量图标.md",
              },
              {
                text: "如何优化字体加载",
                link: "/interview/optimization/09如何优化字体加载.md",
              },
              {
                text: "HTTP2多路复用解决了什么问题",
                link: "/interview/optimization/10HTTP2多路复用解决了什么问题.md",
              },
              {
                text: "HTTP3相比HTTP2有哪些优势",
                link: "/interview/optimization/11HTTP3相比HTTP2有哪些优势.md",
              },
            ],
          },
          {
            text: "Cypress",
            collapsed: true,
            items: [
              {
                text: "Cypress面试核心",
                link: "/interview/cypress/Cypress面试核心.md",
              },
            ],
          },
          {
            text: "项目",
            collapsed: true,
            items: [
              {
                text: "FOFA 实习项目",
                collapsed: true,
                items: [
                  {
                    text: "FOFA实习项目面试点",
                    link: "/interview/project/fofa/FOFA实习项目面试点.md",
                  },
                ],
              },
              {
                text: "低代码问卷系统",
                collapsed: true,
                items: [
                  {
                    text: "低代码问卷项目面试点",
                    link: "/interview/project/questionnaire/低代码问卷项目面试点.md",
                  },
                ],
              },
              {
                text: "VR 全景看房",
                collapsed: true,
                items: [
                  {
                    text: "VR全景看房项目面试点",
                    link: "/interview/project/vr-house-viewing/VR全景看房项目面试点.md",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: "力扣",
        collapsed: true,
        items: [
          {
            text: "链表",
            link: "/leetcode/linked-list.md",
          },
          {
            text: "数组",
            link: "/leetcode/array.md",
          },
          {
            text: "哈希表",
            link: "/leetcode/hash-table.md",
          },
          {
            text: "栈",
            link: "/leetcode/stack.md",
          },
          {
            text: "队列",
            link: "/leetcode/tree.md",
          },
          {
            text: "树",
            link: "/leetcode/tree.md",
          },
          {
            text: "贪心",
            link: "/leetcode/greedy.md",
          },
          {
            text: "图论",
            link: "/leetcode/graph.md",
          },
          {
            text: "动态规划",
            link: "/leetcode/dp.md",
          },
        ],
      },
      {
        text: "案例",
        collapsed: true,
        items: [
          {
            text: "HTML+CSS+JS",
            collapsed: true,
            items: [
              {
                text: "文字滚动效果",
                link: "/demo/html-css-js/01文字滚动效果.md",
              },
            ],
          },
          { text: "简易聊天室", link: "/demo/简易聊天室.md" },
        ],
      },
    ],
  },
});
