<template>
    <p class="cmp-text" :style="css">{{options.text}}</p>
</template>
<script>
export default {
    name: 'cmp-text',
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