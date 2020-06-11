<template>
    <div :style="wrapperStyle">
        <div class="swiper-container swiper-rotate" :id="id" :style="contentStyle">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(url, index) in initialState.slides" :key="index" :style="slideStyle">
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
        },
        initialState: {
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
        this.initSwiper()
    },
    beforeDestroy() {
        this.instance.destroy()
    },
    methods: {
        getInitialState(config) {
            return new Promise(async (resolve, reject) => {
                const slides = await this.fetch(config)
                resolve({ slides })
            })
        },
        initSwiper() {
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
            /**
             * this.$nextTick doesn't work when there are more than one swipers exist on the page
             * setTimeout delay time should >= 4, but with the number of swipers grows, the time
             * should be bigger too, or there will be unexpected bugs
             */
            setTimeout(() => {
                this.instance = new Swiper(`#${this.id}`, swiperOptions)
            }, 20)
        },
        async fetch(config) {
            const result = await this.$dataService.fetch({ source: 'bannerSource' })
            if (result.code === 0 && !!result.data.length) {
                return result.data.slice(0, config.options.nums)
            } 
            return []
        }
    }
}
</script>
