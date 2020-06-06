import DataSources from './dataSource'
import requestCenter from '../requestCenter'
import EventCenter from '../eventCenter'

export class DataCenter {
    constructor() {
        this.dataSourceMap = new Map()
        this.flushMap = new Map()
        this.tick = null
        this.eventCenter = new EventCenter()
    }

    fetch({ source, params }) {
        const currentSource = DataSources[source].call(null, params)
        const { batch } = currentSource
        const action = currentSource.generateAction()

        if (!source || !currentSource) return Promise.resolve()

        if (batch.limit > 1 && this.hasExits(source)) {
            const oldActions = this.dataSourceMap.get(source)
            const newActions = [...oldActions, action]
            console.log('newActions: ', newActions)

            if (newActions.length === batch.limit) {
                console.log('fetch full')

                return new Promise((resolve, reject) => {
                    const cb = action.callback.bind(null, resolve)
                    action.callback = cb
                    this.eventCenter.$once('finish', cb)
                    this.dataSourceMap.set(source, newActions)
                    this.flushDataSourceQueue(source)
                })
            } else {
                console.log('fetch notfull', newActions.length, batch.limit)

                return new Promise((resolve, reject) => {
                    const cb = action.callback.bind(null, resolve)
                    action.callback = cb
                    this.eventCenter.$once('finish', cb)
                    this.dataSourceMap.set(source, newActions)
                    this.flushDataSourceQueue(source)
                })
            }
        } else {
            this.flushMap.set(source, { isFlushPending: false, isFlushing: false })
            this.dataSourceMap.set(source, [action])
        }
        
        return new Promise((resolve, reject) => {
            const cb = action.callback.bind(null, resolve)
            action.callback = cb
            this.eventCenter.$once('finish', cb)
            this.flushDataSourceQueue(source)
        })
    }

    hasExits(hash) {
        return this.dataSourceMap.has(hash) ? true : false
    }

    flushDataSourceQueue(source) {
        const { isFlushing, isFlushPending } = this.flushMap.get(source)
        
        if (!isFlushing && !isFlushPending) {
            this.flushMap.set(source, { isFlushPending: true, isFlushing: false })
            
            this.nextTick(() => {
                const actions = this.dataSourceMap.get(source)
                if (actions && !!actions.length) {
                    this.flushMap.set(source, { isFlushPending: false, isFlushing: true })
                    if (false) { //dataSource.pack(actions)
    
                    } else {
                        actions.forEach(action => {
                            console.log('add')
                            requestCenter.addRequest(action)
                        })
                    }
                    this.flushMap.set(source, { isFlushPending: false, isFlushing: false })
                    this.dataSourceMap.set(source, [])
                }
            })
        }
    }

    nextTick(fn) {
        if (fn && typeof fn === 'function') {
            this.tick = setTimeout(fn, 0)
        }
    }
}
