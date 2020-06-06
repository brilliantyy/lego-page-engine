import { BaseUrl } from '../../config'
// import requestCenter from '../requestCenter'

class DataSource {
    constructor(url, method, params, beforeRequest, afterRequest) {
        this.url = url
        this.method = method
        this.params = params
        this.beforeRequest = beforeRequest
        this.afterRequest = afterRequest
        this.batch = null
        this.isFlushing = false
        this.isFlushPending = false
    }

    setBatch(batch) {
        this.batch = batch
    }

    generateAction() {
        const callback = (resolve, res) => {
           resolve(res)
        }
        return new Action(this.url, this.method, this.params, callback)
    }

    pack(actions) {
        return this.batch.pack(actions)
    }
}

class Batch {
    constructor(pack, unpack, limit = 5) {
        this.pack = typeof pack === 'function' ? pack : () => {}
        this.unpack = typeof unpack === 'function' ? unpack : () => {}
        this.limit = limit
    }
}

class Action {
    constructor(url, method, params, callback) {
        this.url = url
        this.method = method
        this.params = params
        this.callback = callback
    }
}

const bannerSource = function(params) {
    const beforeRequest = function() {
        return this.params
    }
    const afterRequest = function(result) {
        return result
    }
    const source = new DataSource(`${BaseUrl}/data/banner`, 'get', params, beforeRequest, afterRequest)
    const unpack = function(result, actions) {}
    const pack = function(actions) {}
    const batch = new Batch(pack, unpack, 2)

    source.setBatch(batch)
    return source
}

export default {
    bannerSource
}