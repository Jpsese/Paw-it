<template>
  <div
    v-resize="handleElHeight"
    class="adv-scrollable"
  >
    <div
      v-if="$slots.title"
      :style="`height: ${titleHeight}px;`"
    >
      <slot name="title" />
    </div>
    <div
      class="adv-scrollable-container"
      :style="`height: calc(100% - 40px);`"
    >
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      titleHeight: 0
    }
  },
  methods: {
    handleElHeight () {
      if (this.$slots.title) this.titleHeight = this.$slots.title[0].elm.clientHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.adv-scrollable {
  height: 100%;

  & > .adv-scrollable-container {
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;

    & > div {
      position: absolute;
      width: 100%;
    }
  }
}
</style>
