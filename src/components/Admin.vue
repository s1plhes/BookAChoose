<!-- eslint-disable vue/multi-word-component-names -->
<script>
import { userMixin } from '@/mixins/userMixin';
</script>

<template>
    <div v-if="isAdmin = true" class="p-2 text-sm bg-slate-500">
        <pre>Admin Notes:</pre>
        <slot></slot>
    </div>
</template>