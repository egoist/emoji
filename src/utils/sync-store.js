export default function (Vue) {
  Vue.mixin({
    created() {
      const {syncStore} = this.$options
      if (syncStore) {
        const store = JSON.parse(localStorage.getItem('app:store') || '{}')
        for (const name of syncStore) {
          if (typeof store[name] !== 'undefined') {
            this[name] = store[name]
          }
          this.$watch(name, val => {
            store[name] = val
            localStorage.setItem('app:store', JSON.stringify(store))
          })
        }
      }
    }
  })
}
