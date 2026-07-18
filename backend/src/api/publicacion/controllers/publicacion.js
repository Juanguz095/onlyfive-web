'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::publicacion.publicacion', ({ strapi }) => ({
  async mias(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesion')
    }

    const publicaciones = await strapi.entityService.findMany('api::publicacion.publicacion', {
      filters: {
        autor: {
          id: ctx.state.user.id,
        },
      },
      populate: '*',
      sort: {
        createdAt: 'desc',
      },
      limit: 500,
    })

    ctx.body = {
      data: publicaciones.map((publicacion) => ({
        id: publicacion.id,
        attributes: publicacion,
      })),
    }
  },

  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesion')
    }

    const requestBody = ctx.request?.['body'] && typeof ctx.request['body'] === 'object'
      ? ctx.request['body']
      : {}

    const dataBody = requestBody.data && typeof requestBody.data === 'object'
      ? requestBody.data
      : {}

    const creada = await strapi.entityService.create('api::publicacion.publicacion', {
      data: {
        ...dataBody,
        autor: ctx.state.user.id,
      },
      populate: '*',
    })

    ctx.body = {
      data: {
        id: creada.id,
        attributes: creada,
      },
    }
  },

  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesion')
    }

    const publicacionId = Number(ctx.params.id)

    if (Number.isNaN(publicacionId)) {
      return ctx.badRequest('Id de publicacion invalido')
    }

    const existente = await strapi.entityService.findOne('api::publicacion.publicacion', publicacionId, {
      populate: {
        autor: true,
      },
    })

    if (!existente) {
      return ctx.notFound('No se encontro la publicacion solicitada')
    }

    const autorId = typeof existente.autor === 'object' && existente.autor
      ? existente.autor.id
      : existente.autor

    if (autorId && autorId !== ctx.state.user.id) {
      return ctx.forbidden('No tienes permisos para editar esta publicacion')
    }

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

    return super.update(ctx)
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
