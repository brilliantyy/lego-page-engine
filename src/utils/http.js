import { extend } from 'umi-request'

class HttpRequest {
	constructor() {
		this.options = {
			timeout: 20000,
			charset: 'utf8',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		this.requestInstance = extend(this.options)
	}

	static paramIsEmpty() {
		const args = Array.prototype.slice.call(arguments)
		const invalidArgs = args.filter(arg => arg === null || arg === '')

		if (!args.length || invalidArgs.length > 0) throw new Error('参数错误，请检查是否有空参！')
	}

	post(...args) {
		const [url, data, contentType] = Array.prototype.slice.call(args)

		return this.requestInstance.post(url, contentType ? 
			{ headers: { 'Content-Type': contentType }, data }
			: { data })
	}

	get(...args) {
		const [url, params] = Array.prototype.slice.call(args)

		return this.requestInstance.get(url, { params })
	}

	install(Vue) {
		Vue.prototype.$http = this
	}
}

export default new HttpRequest()
