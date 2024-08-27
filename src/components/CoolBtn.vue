<template>
  <component :is="href ? 'RouterLink' : 'button'" :to="href" :class="buttonClasses" @click="handleClick">
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from "vue";

// Props for button configuration
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "danger", "success"].includes(value),
  },
  href: {
    type: String,
    default: "",
  },
  vif: {
    type: String,
    default: "",
  },
  velse: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function,
    default: () => { },
  },
});

// Computed class based on the variant prop
const buttonClasses = computed(() => {
  const baseClasses =
    "p-2 text-sm rounded-md font-semibold focus:outline-none border border-transparent";
  const variantClasses = {
    // primary: "bg-slate-600/30 hover:bg-slate-700/30 text-slate-200 font-sans backdrop-blur-xl ring-1 ring-slate-800/30 hover:text-yellow-500 backdrop-filter focus:outline-none",
    primary: `bg-gradient-to-r from-slate-600/30 via-slate-800/40 
    to-slate-600/30 hover:bg-yellow-500 text-white font-sans
     backdrop-blur-xl hover:text-black backdrop-filter focus:outline-none`,
    secondary: "bg-gray-700 hover:bg-gray-800 focus:outline-none ",
    danger: `bg-gradient-to-r from-slate-600/30 via-slate-800/40 
    to-slate-600/30 hover:bg-red-700 text-white font-sans
     backdrop-blur-xl hover:text-black backdrop-filter focus:outline-none`,
    success: `bg-gradient-to-r from-slate-600/30 via-slate-800/40 
    to-slate-600/30 hover:bg-green-600 text-white font-sans
     backdrop-blur-xl hover:text-black backdrop-filter focus:outline-none`,
    yellow: "bg-yellow-500 hover:bg-yellow-700/50 focus:outline-none",
    fullyellow: "w-full bg-yellow-500 hover:bg-yellow-700 focus:outline-none",
    glass: "bg-slate-700 hover:bg-slate-800 focus:outline-none",
  };
  return `${baseClasses} ${variantClasses[props.variant]} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""
    }`;
});

// Handle click event
const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  props.onClick(event);
};
</script>

<style scoped>
/* Optional: Add any custom styling if needed */
</style>
