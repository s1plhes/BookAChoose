// main.js

import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createHead } from '@unhead/vue';
import { GesturePlugin } from '@vueuse/gesture';
import { MotionPlugin } from '@vueuse/motion';
import authMixin from './mixins/authMixin';
import globalComponents from './plugins/globalComponents';
import autoGlobalComponents from './plugins/autoGlobalComponents';
import { i18n } from './lang/langConfig';
import LikeSystem from './plugins/LikeSystem';
import envVariables from './plugins/envVariables'  // Importa el plugin



// Crear instancia para manejar el head de la app
const head = createHead();
const app = createApp(App);

// Detectar si estamos en producción
export const isProduction = import.meta.env.MODE === 'production';

// Usar plugins y mixins
app.use(envVariables);
app.use(i18n);
app.use(LikeSystem);
app.use(head);
app.use(router);
app.use(globalComponents);
app.use(autoGlobalComponents);
app.mixin(authMixin);
app.use(GesturePlugin);
app.use(MotionPlugin);

// Configuraciones adicionales para desarrollo
app.config.devtools = !isProduction;
app.config.performance = !isProduction;

// Montar la app
app.mount('#app');
