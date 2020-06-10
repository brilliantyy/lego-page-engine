import { DataCenter } from './dataCenter'

export default {
    install: (Vue) => {
        Vue.prototype.$dataService = new DataCenter()
    }
}
