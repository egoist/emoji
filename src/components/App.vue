<template>
  <div id="app">
    <emoji-panel v-if="source" :source="source"></emoji-panel>
    <loading v-else></loading>
  </div>
</template>

<script>
  import EmojiPanel from './EmojiPanel.vue'
  import Loading from './Loading.vue'

  export default {
    name: 'app',
    data() {
      return {
        source: null
      }
    },
    async created() {
      const emojilib = await import('emojilib')
      this.source = Object.keys(emojilib.lib).map(name => ({
        name,
        ...emojilib.lib[name]
      }))
    },
    components: {EmojiPanel, Loading}
  }
</script>

<style>
  body {
    background-color: #f9f9f9;
    margin: 0;
    font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }

  * {
    box-sizing: border-box;
  }
</style>

<style scoped>
  #app {
    max-width: 700px;
    margin: 0 auto;
  }
</style>

