// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

// import { loadFonts } from './plugins/webfontloader' // <-- LÍNEA COMENTADA

// loadFonts() // <-- LÍNEA COMENTADA

createApp(App)
  .use(vuetify)
  .mount('#app')
