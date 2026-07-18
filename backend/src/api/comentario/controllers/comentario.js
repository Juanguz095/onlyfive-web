'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::comentario.comentario', () => ({
  async create(ctx) {
    if (ctx.state.user) {
      const requestBody = ctx.request?.['body'] && typeof ctx.request['body'] === 'object'
        ? ctx.request['body']
        : {}

      const dataBody = requestBody.data && typeof requestBody.data === 'object'
        ? requestBody.data
        : {}

      ctx.request['body'] = {
        ...requestBody,
        data: {
          ...dataBody,
          autor: ctx.state.user.id,
          fecha: dataBody.fecha || new Date().toISOString(),
        },
      }
    }

    return super.create(ctx)
  },

  async find(ctx) {
    const queryActual = /** @type {any} */ (ctx.query || {})
    const nuevoQuery = /** @type {any} */ ({ ...queryActual })

    nuevoQuery.populate = {
      ...(typeof queryActual.populate === 'object' && !Array.isArray(queryActual.populate) ? queryActual.populate : {}),
      autor: true,
      articulo: true,
    }

    ctx.query = nuevoQuery

    return super.find(ctx)
  },
}))
