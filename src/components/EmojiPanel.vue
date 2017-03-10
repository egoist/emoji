<template>
  <div class="main" v-if="source">
    <h1 class="site-name">
      <span>Emoji Searcher</span>
    </h1>
    <div class="input-group">
      <input
        autofocus
        type="text"
        class="input-search"
        placeholder="Type to filter..."
        ref="input"
        @input="handleChange"
        v-model="input">
        <button type="button" class="button-reset" @click="handleReset">Reset</button>
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
</template>

<script>
  import Fuse from 'fuse.js'
  import debounce from 'lodash.debounce'
  import Clipboard from 'clipboard'
  import toast from 'native-toast'

  export default {
    name: 'emoji-panel',
    props: ['source'],
    data() {
      return {
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
          result = fuse.search(this.keyword).slice(0, 12)
        }

        return result
      }
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

<style scoped>
  .site-name {
    font-size: 30px;
    font-weight: 300;
    text-align: center;
    position: relative;
  }

  .site-name:before {
    display: block;
    content: '';
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
  }

  .site-name span {
    z-index: 2;
    position: relative;
    background-color: #f9f9f9;
    padding: 0 20px;
    color: #989898;
    text-shadow: 0 1px 1px white;
  }

  .input-search {
    padding: 10px;
    width: 100%;
    font-size: 18px;
    flex: 4;
    outline: none;
    border: 1px solid #e2e2e2;
    border-radius: 3px 0 0 0px;
    position: relative;
    z-index: 1;
  }

  .input-search:focus {
    border-color: #ccc;
  }

  .emojis {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e2e2e2;
    border-top: none;
    border-radius: 0 0 3px 3px;
    margin-bottom: 30px;
    background-color: white;
  }

  .emoji {
    display: flex;
    align-items: center;
    font-size: 30px;
    width: 25%;
    white-space: nowrap;
    overflow: hidden;
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

  .button-reset {
    flex: 1;
    color: #778087;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 0 3px 0 0;
    background-color: #f9f9f9;
    font-size: 20px;
    font-weight: 300;
    margin-left: -1px;
    position: relative;
  }

  .button-reset:hover {
    background-color: #f0f0f0;
    border-color: #ccc;
    z-index: 2;
  }
</style>

<style>
  @media screen and (max-width: 768px) {
    .emoji {
      width: 50%;
    }
  }
</style>
