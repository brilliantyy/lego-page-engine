<template>
    <div :style="wrapperStyle">
        <div class="swiper-container" :id="id" :style="contentStyle">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(url, index) in slides" :key="index">
                    <img :src="url" :style="{ objectFit: css.objectFit }">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'carousel-normal',
    data() {
        return {
            instance: null,
            slides: []
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        css: {
            type: Object,
            default: () => {}
        },
        options: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        wrapperStyle() {
            const { left, top, right, width, height, paddingLeft, paddingTop, paddingBottom,
            paddingRight, marginTop, marginLeft, marginBottom, marginRight, zIndex, borderColor, borderStyle, borderWidth, boxSizing } = this.css
            return { position: 'absolute', left, top, right, width, height, paddingLeft, paddingTop, paddingBottom, paddingRight,
                marginTop, marginLeft, marginBottom, marginRight, zIndex, borderColor, borderStyle, borderWidth, boxSizing }
        },
        contentStyle() {
            const { borderRadius, backgroundColor } = this.css
            return { height: '100%', borderRadius, backgroundColor }
        }
    },
    mounted() {
        // console.log('result0')
        this.fetch()
        // console.log('result1')
        // this.fetch(1)
        // console.log('result2')
        // this.fetch(2)
        // console.log('result3')
        // this.fetch(3)
    },
    beforeDestroy() {
        this.instance.destroy()
    },
    methods: {
        async fetch() {
            const result = await DataService.fetch({ source: 'bannerSource' })
            if (result.code === 0 && !!result.data.length) {
                this.slides = result.data.slice(0, this.options.nums)
                this.$nextTick(() => {
                    const swiperOptions = {
                        loop: true,
                        autoplay: this.options.autoplay,
                        speed: this.options.speed,
                        delay: this.options.delay,
                        effect: this.options.effect,
                        pagination: {
                            el: '.swiper-pagination'
                        }
                    }
                    this.instance = new Swiper(`#${this.id}`, swiperOptions)
                })
            }
        }
    }
}
</script>
