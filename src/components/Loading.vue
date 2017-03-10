<template>
  <div class="loading-wrapper">
    <div class="loading">
      {{ emoji }}
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 1,
        total: 10
      }
    },
    mounted() {
      setInterval(() => {
        this.count = ++this.count % this.total
      }, 200)
    },
    computed: {
      emoji() {
        return '🔥'.repeat(this.count)
      }
    }
  }
</script>

<style scoped>
  .loading-wrapper {
    height: 100vmin;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading {
    border-radius: 33px;
    border: 1px solid #e2e2e2;
    height: 50px;
    padding: 0 10px;
    font-size: 30px;
    display: flex;
    align-items: center;
    width: 300px;
  }
</style>
