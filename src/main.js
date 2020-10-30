import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(VueTextareaAutosize);

Vue.config.productionTip = false


firebase.initializeApp({
    apiKey: "AIzaSyBbCkSyzlxi00xQx3PcalPJWJELtm7FpMk",
    authDomain: "striker-calendar.firebaseapp.com",
    databaseURL: "https://striker-calendar.firebaseio.com",
    projectId: "striker-calendar",
    storageBucket: "striker-calendar.appspot.com",
    messagingSenderId: "628344508087",
    appId: "1:628344508087:web:70bc299c754c838d890732",
    measurementId: "G-CY8BWH5CY0"
})


export const db = firebase.firestore(); 

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
