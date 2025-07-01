import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
    lang: "zh-CN",

    title: "阿卡不拉",
    description: "阿卡的文档",

    theme: defaultTheme({
        logo: "https://vuejs.press/images/hero.png",

        navbar: ["/", "/get-started"],
    }),

    bundler: viteBundler(),
});
