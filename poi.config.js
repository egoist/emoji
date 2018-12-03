// `NODE_ENV` is set by default by Poi
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: 'src/index.js',
  chainWebpack(config) {
    if (isProd) {
      config.plugin('workbox').use(require('workbox-webpack-plugin').GenerateSW, [
        {
          navigateFallbackWhitelist: [/^(?!\/__).*/],
          navigateFallback: 'index.html',
          exclude: [
            /\.git/,
            /\.map$/,
            /\.DS_Store/,
            /^manifest.*\.js(?:on)?$/,
            /\.gz(ip)?$/,
            /\.br$/,
            /CNAME$/
          ],
          swDest: 'service-worker.js',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/twemoji\.maxcdn\.com\//,
              handler: 'cacheFirst',
              options: {
                cacheableResponse: {
                  statuses: [0, 200],
                  headers: {}
                }
              }
            }
          ]
        }
      ])
    }
  }
}
