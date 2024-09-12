<!-- eslint-disable vue/multi-word-component-names -->
<script></script>

<template>
  <div v-if="(isAdmin = true)" class="p-2 text-sm bg-slate-500">
    <pre>Admin Notes:</pre>
    <slot></slot>
  </div>
</template>
