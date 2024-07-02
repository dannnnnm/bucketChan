//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { io } from "socket.io-client";

import App from './App.vue'
import router from './router'


export const clientSock=io("http://localhost:3000")

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet:'mdi',
      aliases,
      sets:{
        mdi,
      },
    }
  })

app.use(vuetify)


app.use(createPinia())
app.use(router)

app.mount('#app')
