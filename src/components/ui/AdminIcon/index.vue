<template>
  <div class="icon-wrapper" :style="{ ...style }">
    <svg class="icon">
      <use :href="iconName"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'AdminIcon',
  props: {
    name: String,
    prefix: {
      type: String,
      default: 'icon'
    },
    style: Object
  },
  data() {
    return {
      iconName: `#${this.prefix}${this.name}`
    }
  }
}
</script>

<style type="text/css">
.icon-wrapper {
  display: inline-block;
}
.icon {
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
