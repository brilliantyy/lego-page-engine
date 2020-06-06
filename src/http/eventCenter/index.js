class EventCenter {
    constructor() {
        this.eventsMap = new Map()
    }

    $on(eventType, callback) {
        const listeners = this.eventsMap.get(eventType)
        if (listeners && !!listeners.length) {
            this.eventsMap.set(eventType, [...listeners, callback])
        } else {
            this.eventsMap.set(eventType, [callback])
        }
    }

    $once(eventType, callback) {
        const fn = () => {
            const listeners = this.eventsMap.get(eventType)
            if (listeners && !!listeners.length) {
                const index = listeners.findIndex(cb => cb === callback)
                if (index > -1) {
                    listeners.splice(index, 1)
                    return callback()
                }
            }
        }
        this.$on(eventType, fn)
    }

    $emit(eventType, callback, res) {
        const listeners = this.eventsMap.get(eventType)
        if (listeners && !!listeners.length) {
            const index = listeners.findIndex(fn => fn === callback)
            if (index > -1) {
                const cb = callback.bind(null, res)
                cb()
            }
        }
    }

    $off(eventType, callback) {
        const listeners = this.eventsMap.get(eventType)
        if (listeners && !!listeners.length) {
            const index = listeners.findIndex(fn => fn === callback)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }
}

export default EventCenter
