import Vue from 'vue'
import SyncStore from './utils/sync-store'
import App from './components/App.vue'
import track from './track'

Vue.use(SyncStore)

if (process.env.NODE_ENV === 'production') {
  require('./pwa') // eslint-disable-line import/no-unassigned-import
}

new Vue({
  el: '#app',
  render: h => h(App),
  mounted() {
    track()
  }
})
