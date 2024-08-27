// src/plugins/globalComponents.js
// Import components
import btn from '@/components/CoolBtn.vue';
import Modal from '@/components/vueModal.vue';
import ViewIcon from '@/icons/icon_view.vue'
import LikeIcon from '@/icons/icon_like.vue'
import logo from '@/icons/icon_logo.vue'
import { Head } from '@unhead/vue/components'
// Define and export a function to register components globally
export default {
    install(app) {
        // eslint-disable-next-line vue/multi-word-component-names
        app.component('Btn', btn);
        // eslint-disable-next-line vue/multi-word-component-names
        app.component('Modal', Modal);
        // eslint-disable-next-line vue/multi-word-component-names
        app.component('ViewIcon', ViewIcon);
        app.component('LikeIcon', LikeIcon);
        // eslint-disable-next-line vue/multi-word-component-names
        app.component('Logo', logo);
        app.component('reHead', Head);
        // Register other global components here if needed
    }
};