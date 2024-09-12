<template>
  <component
    :is="href ? 'RouterLink' : 'button'"
    :to="href"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

// Props for button configuration
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'yellow'].includes(value)
  },
  href: {
    type: String,
    default: ''
  },
  W: {
    type: String,
    default: ''
  },
  vif: {
    type: String,
    default: ''
  },
  velse: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

// Computed class based on the variant prop
const buttonClasses = computed(() => {
  const baseClasses = `inline-flex w-${props.W} my-2 p-2 justify-center items-center 
  rounded-md text-md leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 font-sans shadow-md`
  const variantClasses = {
    // primary: "bg-slate-600/30 hover:bg-slate-700/30 text-slate-200 font-sans backdrop-blur-xl ring-1 ring-slate-800/30 hover:text-yellow-500 backdrop-filter focus:outline-none",
    primary: `bg-slate-800 hover:bg-yellow-500 text-black hover:text-black text-slate-200`,
    danger: `bg-red-500 hover:bg-red-700 text-black hover:text-white `,
    success: `bg-green-500 hover:bg-green-600 text-black hover:text-black`,
    yellow: 'bg-yellow-500 hover:bg-yellow-700 hover:text-black'
  }
  return `${baseClasses} ${variantClasses[props.variant]} ${
    props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`
})

// Handle click event
const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  props.onClick(event)
}
</script>
