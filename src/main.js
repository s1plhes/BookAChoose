import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createHead } from '@unhead/vue'
import { GesturePlugin } from '@vueuse/gesture'
import { MotionPlugin } from '@vueuse/motion'
import authMixin from './mixins/authMixin';
import globalComponents from './plugins/globalComponents';
import autoGlobalComponents from './plugins/autoGlobalComponents';
import { i18n } from './lang/langConfig'
import LikeSystem from './plugins/LikeSystem';

const head = createHead();
const app = createApp(App);



export const isProduction = process.env.NODE_ENV === 'production';
app.config.globalProperties.NODE_ENV = process.env.NODE_ENV

app.config.globalProperties.SITE_NAME = 'Book-A-choose';
app.config.globalProperties.URL = 'http://localhost:5173';

app.use(i18n);
app.use(LikeSystem);
app.use(head);
app.use(router);
app.use(globalComponents);
app.use(autoGlobalComponents);
app.mixin(authMixin);
app.use(GesturePlugin);
app.use(MotionPlugin);

app.mount('#app');
