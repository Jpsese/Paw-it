import Vue from 'vue'
import moment from 'moment'

Vue.use({
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$moment', {
      value: moment
    })
  }
})
