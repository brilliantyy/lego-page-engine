export function importAll(context) {
	let components = []

	context.keys().forEach(key => {
        // modules = { ...modules, ...context(key) }
        components.push(context(key))
	})
	return components
}
