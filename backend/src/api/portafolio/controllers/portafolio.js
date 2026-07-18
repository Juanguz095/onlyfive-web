'use strict'

const { createCoreController } = require('@strapi/strapi').factories

const slugify = (texto) => String(texto || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

const asegurarSlugUnico = async (strapi, titulo, portafolioIdExcluir = null) => {
  const base = slugify(titulo) || `portafolio-${Date.now()}`
  let slug = base
  let intento = 1

  while (true) {
    const existentes = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        slug_compartible: slug,
      },
      fields: ['id'],
      limit: 1,
    })

    const encontrado = existentes?.[0]

    if (!encontrado || (portafolioIdExcluir && encontrado.id === portafolioIdExcluir)) {
      return slug
    }

    intento += 1
    slug = `${base}-${intento}`
  }
}

const ordenarPublicaciones = (publicaciones, ordenGuardado) => {
  const orden = Array.isArray(ordenGuardado)
    ? ordenGuardado.map((valor) => Number(valor)).filter((valor) => !Number.isNaN(valor))
    : []

  if (orden.length === 0) return publicaciones

  const mapa = new Map(publicaciones.map((publicacion) => [publicacion.id, publicacion]))

  const ordenadas = orden
    .map((idPublicacion) => mapa.get(idPublicacion))
    .filter(Boolean)

  const restantes = publicaciones.filter((publicacion) => !orden.includes(publicacion.id))

  return [...ordenadas, ...restantes]
}

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

  async mio(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión')
    }

    const usuarioId = ctx.state.user.id
    const nombreUsuario = ctx.state.user.username || ctx.state.user.email || `estudiante-${usuarioId}`

    const portafolios = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        estudiante: {
          id: usuarioId,
        },
      },
      populate: {
        publicaciones: true,
      },
      sort: {
        id: 'desc',
      },
      limit: 1,
    })

    let portafolio = portafolios?.[0]

    if (!portafolio) {
      portafolio = await strapi.entityService.create('api::portafolio.portafolio', {
        data: {
          titulo: `Portafolio de ${nombreUsuario}`,
          descripcion: 'Portafolio personal del estudiante.',
          es_publico: false,
          orden_publicaciones: [],
          publicaciones: [],
          estudiante: usuarioId,
        },
        populate: {
          publicaciones: true,
        },
      })
    }

    ctx.body = {
      data: {
        id: portafolio.id,
        attributes: portafolio,
      },
    }
  },

  async actualizarOrden(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión')
    }

    const body = ctx.request?.['body'] && typeof ctx.request['body'] === 'object' ? ctx.request['body'] : {}
    const publicacionesRecibidas = Array.isArray(body.publicaciones)
      ? body.publicaciones
      : Array.isArray(body.data?.publicaciones)
        ? body.data.publicaciones
        : null

    if (!Array.isArray(publicacionesRecibidas)) {
      return ctx.badRequest('Debes enviar publicaciones como arreglo de IDs')
    }

    const ids = publicacionesRecibidas
      .map((valor) => Number(valor))
      .filter((valor) => !Number.isNaN(valor))

    const portafolios = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        estudiante: {
          id: ctx.state.user.id,
        },
      },
      populate: {
        publicaciones: true,
      },
      limit: 1,
    })

    const portafolio = portafolios?.[0]

    if (!portafolio) {
      return ctx.notFound('No se encontró el portafolio del estudiante')
    }

    const idsPublicacionesDisponibles = (portafolio.publicaciones || []).map((publicacion) => publicacion.id)
    const idsFinales = ids.filter((idPublicacion) => idsPublicacionesDisponibles.includes(idPublicacion))

    const actualizado = await strapi.entityService.update('api::portafolio.portafolio', portafolio.id, {
      data: {
        orden_publicaciones: idsFinales,
      },
      populate: {
        publicaciones: true,
      },
    })

    ctx.body = {
      data: {
        id: actualizado.id,
        attributes: actualizado,
      },
    }
  },

  async togglePublico(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Debes iniciar sesión')
    }

    const body = ctx.request?.['body'] && typeof ctx.request['body'] === 'object' ? ctx.request['body'] : {}
    const esPublico = typeof body.es_publico === 'boolean'
      ? body.es_publico
      : typeof body.data?.es_publico === 'boolean'
        ? body.data.es_publico
        : null

    if (esPublico === null) {
      return ctx.badRequest('Debes enviar es_publico con valor booleano')
    }

    const portafolios = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        estudiante: {
          id: ctx.state.user.id,
        },
      },
      limit: 1,
    })

    const portafolio = portafolios?.[0]

    if (!portafolio) {
      return ctx.notFound('No se encontró el portafolio del estudiante')
    }

    let slugCompartible = portafolio.slug_compartible

    if (esPublico) {
      slugCompartible = await asegurarSlugUnico(strapi, portafolio.titulo, portafolio.id)
    }

    const actualizado = await strapi.entityService.update('api::portafolio.portafolio', portafolio.id, {
      data: {
        es_publico: esPublico,
        slug_compartible: slugCompartible,
      },
    })

    ctx.body = {
      data: {
        id: actualizado.id,
        attributes: actualizado,
      },
    }
  },

  async publicoPorSlug(ctx) {
    const { slug } = ctx.params

    if (!slug) {
      return ctx.badRequest('Slug de portafolio no válido')
    }

    const portafolios = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        slug_compartible: slug,
        es_publico: true,
      },
      populate: {
        publicaciones: {
          filters: {
            estado: 'publicado',
          },
        },
      },
      limit: 1,
    })

    const portafolio = portafolios?.[0]

    if (!portafolio) {
      return ctx.notFound('No se encontró el portafolio solicitado')
    }

    const publicacionesRelacionadas = Array.isArray(portafolio['publicaciones']) ? portafolio['publicaciones'] : []
    const ordenGuardado = Array.isArray(portafolio['orden_publicaciones']) ? portafolio['orden_publicaciones'] : []

    const publicacionesOrdenadas = ordenarPublicaciones(publicacionesRelacionadas, ordenGuardado)

    const publicacionesConFormato = publicacionesOrdenadas.map((publicacion) => ({
      id: publicacion.id,
      attributes: publicacion,
    }))

    ctx.body = {
      data: {
        id: portafolio.id,
        attributes: {
          ...portafolio,
          publicaciones: {
            data: publicacionesConFormato,
          },
        },
      },
    }
  },
}))
