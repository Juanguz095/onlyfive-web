'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::portafolio.portafolio', ({ strapi }) => ({
  async create(ctx) {
    if (ctx.state.user) {
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...(ctx.request.body.data || {}),
          estudiante: ctx.state.user.id,
        },
      }
    }

    return super.create(ctx)
  },
}))
