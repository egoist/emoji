const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  webpack(config) {
    if (options.mode === 'production') {
      config.plugins.push(new OfflinePlugin({
        ServiceWorker: {
          events: true
        }
      }))
    }
    return config
  }
})
