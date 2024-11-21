import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import router from './router/index'
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
// app.use(BaseComponents);

app.mount('#app')
