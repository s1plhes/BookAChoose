<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch } from 'vue';
import { user } from '@/mixins/authMixin';
import Cookies from 'js-cookie';
defineProps({
    placeholder: {
        type: String,
        default: '',
    },
});

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Close dropdown when clicking outside
watch(isOpen, (newValue) => {
    if (newValue) {
        document.addEventListener('click', closeDropdown);
    } else {
        document.removeEventListener('click', closeDropdown);
    }
});

const closeDropdown = (event) => {
    if (!event.target.closest('.relative.inline-block')) {
        isOpen.value = false;
    }
};

const avatar = ref(Cookies.get('avatar'))

</script>

<template>
    <div class="relative inline-block text-left ">
        <div class="inline ">
            <button @click="toggleDropdown" type="button" class="inline-flex justify-center w-full rounded-md  
                shadow-sm px-4 py-2 bg-slate-800/40 backdrop-blur-md text-sm font-medium text-slate-100
                 hover:bg-slate-600/20 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-slate-500"
                aria-expanded="true" aria-haspopup="true">
                <div class="space-x-5 inline-flex items-center">
                    <img :src="`${avatar}`" class="w-8 h-8 rounded-full mr-2" /> {{ placeholder }}

                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </button>
        </div>
        <div v-if="isOpen" class="origin-top-right absolute left-0
            mt-2 w-56 rounded-md shadow-lg backdrop-filter backdrop-blur bg-slate-900/80  focus:outline-none 
            hover:bg-slate-900/80 ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical"
            aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
                <ul>
                    <slot />
                </ul>
            </div>
        </div>
    </div>
</template>
