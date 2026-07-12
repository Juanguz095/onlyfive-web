'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::portafolio.portafolio', ({ strapi }) => ({
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
          estudiante: ctx.state.user.id,
        },
      }
    }

    return super.create(ctx)
  },

  async publicoPorSlug(ctx) {
    const { slug } = ctx.params

    if (!slug) {
      return ctx.badRequest('Slug de portafolio no valido')
    }

    const portafolios = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        slug_compartible: slug,
      },
      populate: {
        publicaciones: {
          filters: {
            estado: 'publicado',
          },
          sort: {
            fecha_publicacion: 'desc',
          },
        },
      },
      limit: 1,
    })

    const portafolio = portafolios?.[0]

    if (!portafolio) {
      return ctx.notFound('No se encontro el portafolio solicitado')
    }

    ctx.body = {
      data: {
        id: portafolio.id,
        attributes: portafolio,
      },
    }
  },
}))
