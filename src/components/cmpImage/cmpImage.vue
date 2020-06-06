<template>
    <img class="cmp-image" :src="options.url" :style="css">
</template>
<script>
export default {
    name: 'cmp-image',
    data() {
        return {}
    },
    props: {
        css: {
            type: Object,
            default: () => {}
        },
        options: {
            type: Object,
            default: () => {}
        }
    }
}
</script>