import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VCalendar from 'v-calendar'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'v-calendar/dist/style.css'

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

const app = createApp(App)

app.use(vuetify)
app.use(VCalendar, {})
app.mount('#app')