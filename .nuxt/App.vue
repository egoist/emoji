<template>
  <div id="__nuxt">
    <nuxt-loading ref="loading"></nuxt-loading>
    <component v-if="layout" :is="layout"></component>
  </div>
</template>

<script>
import NuxtLoading from './components/nuxt-loading.vue'

let layouts = {

  "_default": process.BROWSER_BUILD ? () => System.import('/Users/egoist/dev/emoji-search/node_modules/nuxt/dist/app/layouts/default.vue') : require('/Users/egoist/dev/emoji-search/node_modules/nuxt/dist/app/layouts/default.vue')

}

export default {
  head: {},
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  
  mounted () {
    this.$loading = this.$refs.loading
    this.$nuxt.$loading = this.$loading
  },
  
  methods: {
    setLayout (layout) {
      if (!layout || !layouts['_' + layout]) layout = 'default'
      this.layoutName = layout
      let _layout = '_' + layout
      if (typeof layouts[_layout] === 'function') {
        return this.loadLayout(_layout)
      }
      this.layout = layouts[_layout]
      return Promise.resolve(this.layout)
    },
    loadLayout (_layout) {
      return layouts[_layout]()
      .then((Component) => {
        layouts[_layout] = Component
        this.layout = layouts[_layout]
        return this.layout
      })
      .catch((e) => {
        if (this.$nuxt) {
          return this.$nuxt.error({ statusCode: 500, message: e.message })
        }
        console.error(e)
      })
    }
  },
  components: {
    NuxtLoading
  }
}
</script>


