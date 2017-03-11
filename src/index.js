import Vue from 'vue'
import SyncStore from 'src/utils/sync-store'
import App from 'src/components/App'

Vue.use(SyncStore)

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

new Vue({
  el: '#app',
  render: h => h(App)
})
