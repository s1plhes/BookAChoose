export default {
  install: (app) => {
    const envVariables = {}

    // Recorremos todas las variables de entorno que comiencen con 'VITE_'
    Object.keys(import.meta.env).forEach((key) => {
      if (key.startsWith('VITE_')) {
        const varName = key.replace('VITE_', '') // Eliminar el prefijo 'VITE_'
        envVariables[varName] = import.meta.env[key]
      }
    })

    // Registramos las variables de entorno en `globalProperties`
    app.config.globalProperties.$env = envVariables

    // Opción: Registrar las variables directamente en `globalProperties`
    Object.keys(envVariables).forEach((varName) => {
      app.config.globalProperties[varName] = envVariables[varName]
    })
  }
}
