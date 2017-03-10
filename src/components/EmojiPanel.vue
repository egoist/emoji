<template>
  <div class="main" v-if="source">
    <github-badge class="github-icon" slug="egoist/emoji" fill="#999"></github-badge>
    <h1 class="site-name">
      <span>Emoji Searcher</span>
    </h1>
    <div class="control">
      <label class="control-block">
        <el-switch v-model="useDango" /> Search with Dango API
      </label>
      <label class="control-block">
        <el-switch v-model="copyEmojiName" /> Copy emoji name
      </label>
    </div>
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
        :data-clipboard-text="copyEmojiName ? `:${emoji.name}:` : emoji.char"
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
  import GitHubBadge from 'vue-github-badge'
  import { Switch } from 'element-ui'
  import fetch from 'unfetch'

  export default {
    name: 'emoji-panel',
    props: ['source'],
    data() {
      return {
        keyword: null,
        category: null,
        clipboard: null,
        input: null,
        useDango: false,
        copyEmojiName: false,
        emojis: this.source
      }
    },
    created() {
      this.$watch('keyword', this.handleUpdate)
      this.$watch('category', this.handleUpdate)
      this.$watch('useDango', this.handleUpdate)
    },
    methods: {
      handleChange: debounce(function () {
        this.keyword = this.input
      }, 300),
      async handleUpdate() {
        let result = this.source

        if (this.category) {
          result = result.filter(emoji => emoji.category === this.category)
        }

        if (this.keyword) {
          if (this.useDango) {
            const { results } = await fetch(`https://emoji.getdango.com/api/emoji?q=${this.keyword}`).then(res => res.json())
            result = results
              .map(emoji => this.findEmojiByUnicode(emoji.text))
              .filter(emoji => Boolean(emoji))
          } else {
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
        }

        this.emojis = result
      },
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
      },
      findEmojiByUnicode(unicode) {
        return this.source.filter(emoji => {
          return emoji.char === unicode
        })[0]
      }
    },
    components: {
      'github-badge': GitHubBadge,
      'el-switch': Switch
    }
  }
</script>

<style src="native-toast/dist/native-toast.css"></style>

<style scoped>
  .main {
    margin-top: 40px;
  }

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

  .github-icon:hover svg path {
    fill: #333;
  }
</style>

<style>
  .control {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-block {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }

  .control-block label {
    margin-right: 5px;
  }
</style>

<style>
  @media screen and (max-width: 768px) {
    .emoji {
      width: 50%;
    }
  }
</style>
