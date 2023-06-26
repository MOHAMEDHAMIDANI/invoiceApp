import { createApp } from 'vue'
import Modal from './components/Modal.vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'



const app = createApp(App)
app.component('Modal', Modal);
app.use(createPinia())
app.use(router)

app.mount('#app')
