import Vue from 'vue'
import kebabCase from 'lodash/kebabCase'

const requireComponent = require.context('.', false, /Adv[\w]+\.vue$/)

requireComponent.keys().forEach(fileName => {
  const componentName = kebabCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  const componentConfig = requireComponent(fileName)

  Vue.component(componentName, componentConfig.default || componentConfig)
})
