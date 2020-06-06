<template>
    <div :style="wrapperStyle">
        <div class="swiper-container swiper-rotate" :id="id" :style="contentStyle">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(url, index) in slides" :key="index" :style="slideStyle">
                    <img :src="url" :style="{ objectFit: css.objectFit }">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'carousel-rotate',
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
            return { height: '100%' }
        },
        slideStyle() {
            const { slideWidth, borderRadius, backgroundColor } = this.css
            return { width: slideWidth, backgroundColor, borderRadius }
        }
    },
    mounted() {
        this.fetch()
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
                    const self = this
                    const swiperOptions = {
                        slidesPerView: 'auto',
                        watchSlidesProgress: true,
                        centeredSlides: true,
                        loop: true,
                        autoplay: this.options.autoplay,
                        speed: this.options.speed,
                        delay: this.options.delay,
                        loopedSlides: 3,
                        effect: 'coverflow',
                        coverflowEffect: {
                            rotate: 0,
                            stretch: 10,
                            depth: 80,
                            modifier: 3,
                            slideShadows : true
                        }
                    }
                    this.instance = new Swiper(`#${this.id}`, swiperOptions)
                })
            }
        }
    }
}
</script>
