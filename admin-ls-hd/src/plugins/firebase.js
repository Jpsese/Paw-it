import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyAbgPM7LIqix34ykq9_QeQocSOrxQ--N5U',
  authDomain: 'pawit-c3960.firebaseapp.com',
  databaseURL: 'https://pawit-c3960.firebaseio.com',
  projectId: 'pawit-c3960',
  storageBucket: 'pawit-c3960.appspot.com',
  messagingSenderId: '819231145639'
}

// PANEL1 CONFIG

// const config = {
//   apiKey: "AIzaSyAGMk63wYqFTzn8WZxj3qg95ndVEqsPCBA",
//   authDomain: "pawit-panel1.firebaseapp.com",
//   databaseURL: "https://pawit-panel1.firebaseio.com",
//   projectId: "pawit-panel1",
//   storageBucket: "pawit-panel1.appspot.com",
//   messagingSenderId: "692601677441",
// }

// PANEL2 CONFIG

// const config = {
//   apiKey: "AIzaSyDMQBO7aFXeBMNtA6Q7U1pr6adqrsbJc4o",
//   authDomain: "pawit-panel2.firebaseapp.com",
//   databaseURL: "https://pawit-panel2.firebaseio.com",
//   projectId: "pawit-panel2",
//   storageBucket: "pawit-panel2.appspot.com",
//   messagingSenderId: "922428940526",
// }

const fireApp = firebase.initializeApp(config)

Vue.use({
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$firebase', {
      value: fireApp
    })
  }
})

Vue.use({
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$database', {
      value: ref => fireApp.database().ref(ref)
    })
  }
})

export default fireApp

export const $database = ref => fireApp.database().ref(ref)
