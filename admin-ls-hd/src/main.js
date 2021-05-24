import Vue from 'vue'
import App from './App.vue'
import './components/_globals'
import './directives/on-hold'
import firebase from './plugins/firebase'
import './plugins/vuefire'
import './plugins/lodash'
import './plugins/moment'
import './plugins/vuetify'
import router from './router'
import store from './store'

Vue.config.productionTip = false

let app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
