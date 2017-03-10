const path = require('path')
const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  webpack(config) {
    if (!options.dev) {
      config.plugins.push(new OfflinePlugin({
        ServiceWorker: {
          events: true
        }
      }))
    }
    return config
  }
})
