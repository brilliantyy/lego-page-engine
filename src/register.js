import Vue from 'vue'
import { importAll } from './utils/index'

function registerComponents () {
    const components = importAll(require.context('./components', true, /\.vue$/))

    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

async function constructPage() {
    if (window.__PAGE_DATA__) {
        const cmps = []
        let { pageConfig, componentsConfig } = __PAGE_DATA__
        setPageData(pageConfig)

        if (!!componentsConfig.length) {
            for (let i = 0; i < componentsConfig.length; i++) {
                const data = componentsConfig[i]
                const CmpConstructor = Vue.component(data.name)
                
                if (typeof CmpConstructor === 'function') {
                    let initialState = {}
                    const tempInstance = new CmpConstructor()
                    if (tempInstance.$options.methods) {
                        const { getInitialState } = tempInstance.$options.methods
                        if (typeof getInitialState === 'function') {
                            initialState = await getInitialState.call(tempInstance, { id: data.id, options: data.options })
                        }
                    }
                    const cmpInstance = new CmpConstructor({
                        propsData: {
                            id: data.id,
                            css: transformCss(data.css),
                            options: data.options,
                            initialState: initialState
                        }
                    }).$mount()
                    cmps.push(cmpInstance.$el)
                }
            }
        }
        const rootEl = document.getElementById('lego-app')
        cmps.forEach(el => {
            rootEl.appendChild(el)
        })

        console.log(__PAGE_DATA__)
    }
}

function setPageData(pageConfig) {
    const { title, pageHeight, backgroundColor, backgroundImage, backgroundRepeat, backgroundSize } = pageConfig
    const rootFontSize = parseFloat(document.documentElement.style.fontSize)

    document.title = title
    document.body.style.height = `${parseFloat(pageHeight/rootFontSize).toFixed(2)}rem`
    document.body.style.backgroundImage = `url(${backgroundImage})`
    document.body.style.backgroundColor = backgroundColor
    document.body.style.backgroundRepeat = backgroundRepeat
    document.body.style.backgroundSize = backgroundSize
}

function transformCss(cssObj) {
    const attrs = [
        'width', 'height', 'left', 'top', 'bottom', 'right', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight', 'letterSpacing',
        'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'marginTop', 'margiLeft', 'marginBottom', 'marginRight', 'slideWidth'
    ]
    const rootFontSize = parseFloat(document.documentElement.style.fontSize)
    const copyCssObj = Object.assign({}, cssObj)

    Object.keys(copyCssObj).forEach(key => {
        if (attrs.includes(key)) {
            copyCssObj[key] = `${parseFloat(copyCssObj[key]/rootFontSize).toFixed(2)}rem`
        }
    })
    copyCssObj.position = 'absolute'
    return copyCssObj
}

export default function initPage() {
    registerComponents()
    constructPage()
}