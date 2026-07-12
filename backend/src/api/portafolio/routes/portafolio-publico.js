'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/portafolios/publico/:slug',
      handler: 'portafolio.publicoPorSlug',
      config: {
        auth: false,
      },
    },
  ],
}
