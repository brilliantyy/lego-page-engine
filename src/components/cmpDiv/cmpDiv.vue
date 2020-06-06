<template>
    <div class="cmp-div" :style="css"></div>
</template>
<script>
export default {
    name: 'cmp-div',
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