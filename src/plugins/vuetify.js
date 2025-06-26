/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    // ---- PRIMER CAMBIO: FONDO BLANCO ----
    // Establecemos que el tema por defecto sea 'light' (claro).
    // El tema 'light' tiene fondos blancos y texto oscuro.
    defaultTheme: 'light',

    themes: {
      light: {
        dark: false, // Aseguramos que no es un tema oscuro
        colors: {
          // ---- SEGUNDO CAMBIO: NAVBAR VERDE ----
          // Cambiamos el color 'primary'. Como nuestro Navbar usa color="primary",
          // ahora se mostrará con este tono de verde oscuro y profesional.
          primary: '#1B5E20', // Un tono de verde oscuro (Material Design Green 900)

          // Puedes definir otros colores si quieres
          secondary: '#424242', // Un gris oscuro para elementos secundarios
          success: '#4CAF50', // El verde para las alertas de éxito
        }
      }
    }
  }
})
