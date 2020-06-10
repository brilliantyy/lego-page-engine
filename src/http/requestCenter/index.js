import Crypto from 'crypto-js'
import Http from '@/utils/http'

class RequestCenter {
    constructor() {
        this.requestMap = new Map()
    }

    addRequest(action) {
        const { url, method, params, callback } = action
        const key = this.genHash(url, method, params)
        if (this.requestMap.has(key)) {
            const { status, callbacks, cacheData } = this.requestMap.get(key)

            switch(status) {
                case 0:                              // 等待中 
                    callbacks.push(callback)
                    break;
                case 1:                              // 已完成 
                    callback.bind(null, cacheData)()
                    break;
                case 2:                              // 响应异常
                    
                    break;
                default: return
            }

        } else {
            this.requestMap.set(key, {
                status: 0,
                callbacks: [callback],
                cacheData: null
            })
            this.sendRequest(url, method, params, key)
        }
    }

    genHash(url, method, params) {
        const source = `${url}_${method}_${JSON.stringify(this.formatParams(params))}`
        return Crypto.MD5(source).toString()
    }

    formatParams(params) {
        if (Object.prototype.toString.call(params) === '[object Object]') {
            const keys = Object.keys(params).sort()
            const res = Object.create(null)
            keys.forEach(key => {
                res[key] = this.formatParams(params[key])
            })
            return res
        }
        return params
    }

    sendRequest(url, method, params = {}, key) {
        Http[method](url, params).then(res => {
            if (res.code === 0) {
                const { callbacks } = this.requestMap.get(key)
                if (callbacks && !!callbacks.length) {
                    callbacks.forEach(cb => {
                        cb.bind(null, res)()
                    })
                }
                this.requestMap.set(key, { status: 1, callbacks: [], cacheData: res })
            } else {
            }
        }).catch(err => {})
    }

}

export default new RequestCenter()
