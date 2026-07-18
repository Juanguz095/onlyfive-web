'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::articulo.articulo', () => ({
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
        },
      }
    }

    return super.create(ctx)
  },

  async find(ctx) {
    if (!ctx.state.user) {
      const queryActual = /** @type {any} */ (ctx.query || {})
      const filtrosActuales = queryActual.filters && typeof queryActual.filters === 'object' && !Array.isArray(queryActual.filters)
        ? queryActual.filters
        : {}

      const nuevoQuery = /** @type {any} */ ({ ...queryActual })
      nuevoQuery.filters = {
        ...filtrosActuales,
        estado: {
          $eq: 'publicado',
        },
      }

      ctx.query = nuevoQuery
    }

    return super.find(ctx)
  },

  async findOne(ctx) {
    const respuesta = await super.findOne(ctx)

    if (!ctx.state.user && respuesta?.data?.attributes?.estado !== 'publicado') {
      return ctx.notFound()
    }

    return respuesta
  },
}))
