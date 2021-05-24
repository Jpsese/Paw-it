import Vue from 'vue'
import _ from 'lodash'

Vue.use({
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$_', {
      value: _
    })
  }
})
