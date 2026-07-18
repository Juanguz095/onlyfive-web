'use strict'

const { createCoreRouter } = require('@strapi/strapi').factories

const defaultRouter = createCoreRouter('api::portafolio.portafolio', {
  config: {
    find: { auth: { scope: [] } },
    findOne: { auth: { scope: [] } },
    create: { auth: { scope: [] } },
    update: { auth: { scope: [] } },
    delete: { auth: { scope: [] } },
  },
})

const customRoutes = [
  {
    method: 'GET',
    path: '/portafolios/publico/:slug',
    handler: 'portafolio.publicoPorSlug',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/portafolios/mio',
    handler: 'portafolio.mio',
    config: { auth: { scope: [] } },
  },
  {
    method: 'PUT',
    path: '/portafolios/orden',
    handler: 'portafolio.actualizarOrden',
    config: { auth: { scope: [] } },
  },
  {
    method: 'PUT',
    path: '/portafolios/toggle-publico',
    handler: 'portafolio.togglePublico',
    config: { auth: { scope: [] } },
  },
]

let routes

const getDefaultRoutes = () => {
  if (typeof defaultRouter.routes === 'function') {
    return defaultRouter.routes()
  }

  return defaultRouter.routes
}

module.exports = {
  get prefix() {
    return defaultRouter.prefix
  },
  get routes() {
    if (!routes) {
      routes = [...getDefaultRoutes(), ...customRoutes]
    }

    return routes
  },
}
