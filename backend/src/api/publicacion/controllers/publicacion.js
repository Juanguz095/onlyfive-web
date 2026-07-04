'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::publicacion.publicacion', ({ strapi }) => ({
  async create(ctx) {
    if (ctx.state.user) {
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...(ctx.request.body.data || {}),
          autor: ctx.state.user.id,
        },
      }
    }

    return super.create(ctx)
  },

  async find(ctx) {
    if (!ctx.state.user) {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query.filters || {}),
          estado: {
            $eq: 'publicado',
          },
        },
      }
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
