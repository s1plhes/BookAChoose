// Import all Vue components from the components directory
const components = import.meta.glob('../components/*.vue', { eager: true })

export default {
  install(app) {
    Object.entries(components).forEach(([path, component]) => {
      const componentName = path.split('/').pop().replace('.vue', '')
      app.component(componentName, component.default || component)
    })
  }
}
