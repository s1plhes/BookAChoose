<!-- eslint-disable vue/multi-word-component-names 
<template>
    <div>Visits: {{ visitCount }}</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, increment, update } from "firebase/database"

export default {
    setup() {
        const visitCount = ref(0)

        onMounted(() => {
            const db = getDatabase()
            const visitsRef = dbRef(db, 'visits')

            // Increment the visit count
            update(visitsRef, {
                count: increment(1)
            })

            // Listen for changes to the visit count
            onValue(visitsRef, (snapshot) => {
                visitCount.value = snapshot.val().count
            })
        })

        return { visitCount }
    }
}
</script>-->
<template>
    visitors
</template>