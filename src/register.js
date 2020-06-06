import Vue from 'vue'
import { importAll } from './utils/index'

function registerComponents () {
    const components = importAll(require.context('./components', true, /\.vue$/))

    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

function constructPage() {
    if (window.__PAGE_DATA__) {
        const cmps = []
        let { pageConfig, componentsConfig } = __PAGE_DATA__
        setPageData(pageConfig)

        if (!!componentsConfig.length) {
            componentsConfig.forEach(data => {
                const CmpConstructor = Vue.component(data.name)
              
                if (typeof CmpConstructor === 'function') {
                    const cmpInstance = new CmpConstructor({
                        propsData: {
                            id: data.id,
                            css: transformCss(data.css),
                            options: data.options
                        }
                    }).$mount()
                    cmps.push(cmpInstance.$el)
                }
            })
        }
       
        const rootEl = document.getElementById('lego-app')
        cmps.forEach(el => {
            rootEl.appendChild(el)
        })

        console.log(__PAGE_DATA__)
    }
}

function setPageData(pageConfig) {
    const { title, pageHeight, backgroundColor, backgroundImage, backgroundRepeat } = pageConfig
    const rootFontSize = parseFloat(document.documentElement.style.fontSize)

    document.title = title
    document.body.style.height = `${parseFloat(pageHeight/rootFontSize).toFixed(2)}rem`
    document.body.style.backgroundImage = `url(${backgroundImage})`
    document.body.style.backgroundColor = backgroundColor
    document.body.style.backgroundRepeat = backgroundRepeat
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