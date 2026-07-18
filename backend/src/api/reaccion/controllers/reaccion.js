'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::reaccion.reaccion', ({ strapi }) => ({
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

    const articuloId = Number(dataBody.articulo)
    const tipo = dataBody.tipo

    if (Number.isNaN(articuloId) || typeof tipo !== 'string') {
      return ctx.badRequest('Debes indicar articulo y tipo de reaccion')
    }

    const tipoNormalizado = tipo === 'love'
      ? 'love'
      : tipo === 'celebration'
        ? 'celebration'
        : tipo === 'idea'
          ? 'idea'
          : tipo === 'like'
            ? 'like'
            : null

    if (!tipoNormalizado) {
      return ctx.badRequest('Debes indicar articulo y tipo de reaccion')
    }

    const existentes = await strapi.entityService.findMany('api::reaccion.reaccion', {
      filters: {
        usuario: {
          id: ctx.state.user.id,
        },
        articulo: {
          id: articuloId,
        },
        tipo: {
          $eq: tipoNormalizado,
        },
      },
      limit: 1,
    })

    const reaccionExistente = existentes?.[0]

    if (reaccionExistente) {
      await strapi.entityService.delete('api::reaccion.reaccion', reaccionExistente.id)

      ctx.body = {
        toggled: true,
        data: null,
      }
      return
    }

    ctx.request['body'] = {
      ...requestBody,
      data: {
        ...dataBody,
        usuario: ctx.state.user.id,
        articulo: articuloId,
        tipo: tipoNormalizado,
      },
    }

    return super.create(ctx)
  },

  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesion')
    }

    const reaccionId = Number(ctx.params.id)

    if (Number.isNaN(reaccionId)) {
      return ctx.badRequest('Id de reaccion invalido')
    }

    const reaccion = await strapi.entityService.findOne('api::reaccion.reaccion', reaccionId, {
      populate: {
        usuario: true,
      },
    })

    if (!reaccion) {
      return ctx.notFound('No se encontro la reaccion')
    }

    const usuarioId = typeof reaccion.usuario === 'object' && reaccion.usuario
      ? reaccion.usuario.id
      : reaccion.usuario

    if (usuarioId && usuarioId !== ctx.state.user.id) {
      return ctx.forbidden('No tienes permisos para eliminar esta reaccion')
    }

    return super.delete(ctx)
  },
}))
