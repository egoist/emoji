<template>
  <div id="app">
    <h1>Emoji Search</h1>
    <h1 v-if="!source">Loading...</h1>
    <div class="main" v-if="source">
      <div class="input-group">
        <input
          autofocus
          type="text"
          class="input-search"
          placeholder="Type to filter..."
          ref="input"
          @input="handleChange"
          v-model="input">
          <button type="button" class="btn" @click="handleReset">Reset</button>
      </div>
      <div class="emojis">
        <div
          v-for="emoji in emojis"
          class="emoji"
          :data-clipboard-text="`:${emoji.name}:`"
          @mouseover="initClipboard"
          @mouseout="destroyClipboard">
          <span class="emoji-image">
            {{ emoji.char }}
          </span>
          <span class="emoji-description">
            :{{ emoji.name }}:
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Fuse from 'fuse.js'
  import debounce from 'lodash.debounce'
  import Clipboard from 'clipboard'
  import toast from 'native-toast'

  export default {
    data() {
      return {
        source: null,
        keyword: null,
        category: null,
        clipboard: null,
        input: null
      }
    },
    computed: {
      emojis() {
        let result = this.source

        if (this.category) {
          result = result.filter(emoji => emoji.category === this.category)
        }

        if (this.keyword) {
          const fuse = new Fuse(result, {
            keys: [{
              name: 'keywords',
              weight: 0.7
            }, {
              name: 'name',
              weight: 0.3
            }]
          })
          result = fuse.search(this.keyword).slice(0, 10)
        }

        return result
      }
    },
    async created() {
      const emojilib = await import('emojilib')
      this.source = Object.keys(emojilib.lib).map(name => ({
        name,
        ...emojilib.lib[name]
      }))
    },
    methods: {
      handleChange: debounce(function () {
        this.keyword = this.input
      }, 300),
      handleReset() {
        this.input = null
        this.keyword = null
        this.$refs.input.focus()
      },
      initClipboard({currentTarget}) {
        this.clipboard = new Clipboard(currentTarget)
        this.clipboard.on('success', e => {
          toast({message: `Copied ${e.text}`, type: 'success'})
        })
        this.clipboard.on('error', e => {
          toast({message: 'Failed to copy!', type: 'error'})
        })
      },
      destroyClipboard() {
        if (this.clipboard) {
          this.clipboard.destroy()
          this.clipboard = null
        }
      }
    }
  }
</script>

<style src="native-toast/dist/native-toast.css"></style>

<style>
  body {
    background-color: #f9f9f9;
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

  .input-search {
    padding: 10px;
    width: 100%;
    font-size: 18px;
    flex: 4;
  }

  .emojis {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }

  .emoji {
    display: flex;
    align-items: center;
    font-size: 30px;
    width: 25%;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 3px;
    padding: 5px 10px;
  }

  .emoji:hover {
    background-color: #f0f0f0;
    cursor: default;
    box-shadow: inset 0 0 1px #ccc;
  }

  .emoji .emoji-description {
    font-size: 14px;
    margin-left: 10px;
  }

  .input-group {
    display: flex;
  }

  .btn {
    flex: 1;
    color: #000;
    background-color: #fff;
  }
</style>

<style>
  @media screen and (max-width: 768px) {
    .emoji {
      width: 50%;
    }
  }
</style>
