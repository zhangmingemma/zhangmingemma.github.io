const path = require('path')

module.exports = {
    parallel: false,
    publicPath: process.env.NODE_ENV === "production" ? "/zhangmingemma.github.io" : "/",
    chainWebpack: config => {
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            })

        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: [
                        './src/utils/style/_fn.scss', 
                        './src/utils/style/_var.scss', 
                        './src/utils/style/_common.scss'
                    ]
                })
                .end()
        })
    },
    configureWebpack: () => {
        return {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, "src"),
                    '@style': path.resolve(__dirname, "src/utils/style"),
                    '@tool': path.resolve(__dirname, "src/utils/tool"),
                }
            }
        }
    }
}