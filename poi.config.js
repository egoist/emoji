// `NODE_ENV` is set by default by Poi
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: 'src/index.js',
  chainWebpack(config) {
    if (isProd) {
      config.plugin('offline').use(require('offline-plugin'), [
        {
          ServiceWorker: {
            events: true
          }
        }
      ])
    }
  }
}
