import { createApp } from 'vue'
import App from './App.vue'
import './theme.css'
import VueCryptojs from 'vue-cryptojs'

createApp(App).use(VueCryptojs).mount('#app')
