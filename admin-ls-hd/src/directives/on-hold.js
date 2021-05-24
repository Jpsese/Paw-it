import Vue from 'vue'

Vue.directive('hold', {
  bind (el, binding) {
    el.addEventListener('mousedown', () => binding.value(true))
    el.addEventListener('mouseup', () => binding.value(false))
  }
})
