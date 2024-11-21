
import { createVuetify } from 'vuetify'
// import '@/sass/overrides.sass'

import 'vuetify/styles'; // Import Vuetify styles
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
// const theme = {
//   primary: '#4CAF50',
//   secondary: '#9C27b0',
//   accent: '#9C27b0',
//   info: '#00CAE3',
// }
const theme = {
  primary: '#46494cff',
  secondary: '#95a3b3ff',
  accent: '#7494eaff'
}
// $syracuse-red-orange: #e53d00ff;
// $light-green: #b9f18cff;
// $outer-space: #46494cff;
// $cadet-gray: #95a3b3ff;
// $cornflower-blue: #7494eaff;
const themes = {
  customLightTheme: {
    colors: {
    primary: '#333333', // Dark Gray for the primary color
    secondary: '#FF6F00', // Orange for the secondary color,
    anchor: "#FF6F00",
    accent: '#FF6F00', // Light Gray for accent elements
    error: '#D32F2F', // Optional error color (red)
    info: 'pink',  // Optional info color (blue),
    loading: 'pink',
    success: '#4CAF50', // Optional success color (green)
    warning: '#FFB300', // Optional warning color (yellow-orange)
    background: '#1E1E1E', // Dark tone background
    surface: '#2C2C2C' // Slightly lighter dark tone for surfaces
    }
  },
  dark: {
    colors: {
    primary: '#FFFFFF', // White for contrast in dark theme mode
    secondary: '#FF6F00', // Keep the orange for contrast
    accent: '#757575', // Medium gray for accent in dark theme
    error: '#D32F2F',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFB300',
    background: '#FFFFFF', // Darker background for dark mode
    surface: '#333333' // Dark gray surface in dark mode
    }
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes
  },
  icons: {
    defaultSet: 'mdi', // Make sure Vuetify uses MDI as the default icon set
    aliases,
    sets: {
      mdi
    },
  },
  components,
  directives
})
