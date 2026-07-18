'use strict'

const accionesPorRol = {
  public: [
    'api::publicacion.publicacion.find',
    'api::publicacion.publicacion.findOne',
    'api::articulo.articulo.find',
    'api::articulo.articulo.findOne',
    'api::comentario.comentario.find',
    'api::reaccion.reaccion.find',
    'api::portafolio.portafolio.publicoPorSlug',
    'api::chatbot.chatbot.responder',
  ],
  authenticated: [
    'api::publicacion.publicacion.find',
    'api::publicacion.publicacion.findOne',
    'api::publicacion.publicacion.create',
    'api::publicacion.publicacion.update',
    'api::publicacion.publicacion.delete',
    'api::publicacion.publicacion.mias',

    'api::portafolio.portafolio.find',
    'api::portafolio.portafolio.findOne',
    'api::portafolio.portafolio.create',
    'api::portafolio.portafolio.update',
    'api::portafolio.portafolio.delete',
    'api::portafolio.portafolio.actualizarOrden',
    'api::portafolio.portafolio.togglePublico',
    'api::portafolio.portafolio.mio',

    'api::articulo.articulo.find',
    'api::articulo.articulo.findOne',
    'api::articulo.articulo.create',
    'api::articulo.articulo.update',
    'api::articulo.articulo.delete',

    'api::comentario.comentario.find',
    'api::comentario.comentario.findOne',
    'api::comentario.comentario.create',
    'api::comentario.comentario.update',
    'api::comentario.comentario.delete',

    'api::reaccion.reaccion.find',
    'api::reaccion.reaccion.findOne',
    'api::reaccion.reaccion.create',
    'api::reaccion.reaccion.update',
    'api::reaccion.reaccion.delete',

    'api::chatbot.chatbot.responder',
    'plugin::upload.content-api.upload',
  ],
}

const esPermisoDelProyecto = (accion) => (
  accion.startsWith('api::publicacion.') ||
  accion.startsWith('api::portafolio.') ||
  accion.startsWith('api::chatbot.') ||
  accion.startsWith('api::conversacion-chat.') ||
  accion.startsWith('api::mensaje-chat.') ||
  accion.startsWith('api::articulo.') ||
  accion.startsWith('api::comentario.') ||
  accion.startsWith('api::reaccion.') ||
  accion.startsWith('plugin::upload.')
)

const configurarPermisos = async (strapi, tipoRol, accionesPermitidas) => {
  const rol = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: tipoRol },
    populate: ['permissions'],
  })

  if (!rol) return

  const accionesActuales = rol.permissions || []

  await Promise.all(
    accionesActuales
      .filter((permiso) => esPermisoDelProyecto(permiso.action) && !accionesPermitidas.includes(permiso.action))
      .map((permiso) => (
        strapi.query('plugin::users-permissions.permission').delete({
          where: { id: permiso.id },
        })
      ))
  )

  const accionesExistentes = new Set(accionesActuales.map((permiso) => permiso.action))

  await Promise.all(
    accionesPermitidas
      .filter((accion) => !accionesExistentes.has(accion))
      .map((accion) => (
        strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: accion,
            role: rol.id,
          },
        })
      ))
  )
}

const datosPublicacionesIniciales = [
  {
    titulo: 'Torta tres leches con frutos rojos',
    descripcion: 'Receta de practica para el portafolio del estudiante.',
    estado: 'publicado',
    categoria: 'Postre',
    ciclo: 'CICLO III',
    tipo: 'PROYECTOS',
    taller: 'Cocina Creativa II',
    docente: 'Prof. Melvin Nolazco',
  },
  {
    titulo: 'Chicha morada de maracuya',
    descripcion: 'Bebida publicada como ejemplo inicial.',
    estado: 'publicado',
    categoria: 'Bebida',
    ciclo: 'CICLO V',
    tipo: 'PROYECTOS',
    taller: 'Reposteria Avanzada',
    docente: 'Prof. Melvin Nolazco',
  },
  {
    titulo: 'Alfajores de maicena',
    descripcion: 'Borrador de receta dulce.',
    estado: 'borrador',
    categoria: 'Dulce',
    ciclo: 'CICLO I',
    tipo: 'TALLERES',
    taller: 'Cocina Basica I',
    docente: 'Prof. Melvin Nolazco',
  },
  {
    titulo: 'Ensaladas templadas y tecnicas de corte basico',
    descripcion: 'Trabajo practico con documentacion de cortes juliana, brunoise y chiffonade.',
    estado: 'publicado',
    categoria: 'Entrada',
    ciclo: 'CICLO I',
    tipo: 'TALLERES',
    taller: 'Cocina Basica I',
    docente: 'Prof. Melvin Nolazco',
  },
]

const datosArticulosIniciales = [
  {
    titulo: 'Tendencias de cocina sostenible 2026',
    resumen: 'Resumen sobre tecnicas de cocina sostenible aplicadas a talleres academicos.',
    contenido: 'Este articulo presenta practicas de aprovechamiento integral de insumos, reduccion de desperdicios y planificacion de menu sostenible en el aula de cocina.',
    imagen: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Innovacion culinaria',
    estado: 'publicado',
  },
  {
    titulo: 'Mise en place: base para la eficiencia en cocina',
    resumen: 'Como organizar estaciones de trabajo para mejorar tiempos y calidad.',
    contenido: 'La mise en place permite ejecutar recetas con mayor precision, reducir errores y reforzar el trabajo colaborativo durante practicas de laboratorio.',
    imagen: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Tecnicas profesionales',
    estado: 'publicado',
  },
  {
    titulo: 'Control de costos en proyectos gastronomicos',
    resumen: 'Guia introductoria para costear recetas y mejorar rentabilidad academica.',
    contenido: 'Se revisan criterios para calcular costo por porcion, margen esperado y estandarizacion de fichas tecnicas para proyectos de estudiantes.',
    imagen: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
    categoria: 'Gestion',
    estado: 'publicado',
  },
]

const crearContenidoInicial = async (strapi) => {
  const email = 'estudiante@onlyfive.test'
  const password = 'Password123'

  const rolEstudiante = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'authenticated' },
  })

  if (!rolEstudiante) return

  let estudiante = await strapi.query('plugin::users-permissions.user').findOne({
    where: { email },
  })

  if (!estudiante) {
    estudiante = await strapi.plugin('users-permissions').service('user').add({
      username: 'Estudiante OnlyFive',
      email,
      password,
      provider: 'local',
      confirmed: true,
      blocked: false,
      role: rolEstudiante.id,
    })
  }

  const publicacionesExistentes = await strapi.entityService.findMany('api::publicacion.publicacion', {
    filters: {
      autor: {
        id: estudiante.id,
      },
    },
  })

  if (publicacionesExistentes.length > 0) {
    await Promise.all(
      publicacionesExistentes.map((publicacion, indice) => {
        const datos = datosPublicacionesIniciales[indice % datosPublicacionesIniciales.length]

        return strapi.entityService.update('api::publicacion.publicacion', publicacion.id, {
          data: {
            ciclo: publicacion.ciclo || datos.ciclo,
            tipo: publicacion.tipo || datos.tipo,
            taller: publicacion.taller || datos.taller,
            docente: publicacion.docente || datos.docente,
          },
        })
      })
    )
  } else {
    const publicaciones = await Promise.all([
      ...datosPublicacionesIniciales.map((datos) => (
        strapi.entityService.create('api::publicacion.publicacion', {
          data: {
            ...datos,
            fecha_publicacion: datos.estado === 'publicado' ? new Date().toISOString() : null,
            autor: estudiante.id,
          },
        })
      )),
    ])

    const portafoliosExistentes = await strapi.entityService.findMany('api::portafolio.portafolio', {
      filters: {
        estudiante: {
          id: estudiante.id,
        },
      },
      limit: 1,
    })

    if (portafoliosExistentes.length === 0) {
      await strapi.entityService.create('api::portafolio.portafolio', {
        data: {
          titulo: 'Portafolio de cocina',
          descripcion: 'Portafolio inicial del estudiante.',
          slug_compartible: 'portafolio-cocina',
          es_publico: false,
          estudiante: estudiante.id,
          publicaciones: publicaciones.map((publicacion) => publicacion.id),
        },
      })
    }
  }

  const articulosExistentes = await strapi.entityService.findMany('api::articulo.articulo', {
    filters: {
      autor: {
        id: estudiante.id,
      },
    },
    limit: 1,
  })

  if (articulosExistentes.length === 0) {
    await Promise.all(
      datosArticulosIniciales.map((articulo) => (
        strapi.entityService.create('api::articulo.articulo', {
          data: {
            ...articulo,
            fecha_publicacion: new Date().toISOString(),
            autor: estudiante.id,
          },
        })
      ))
    )
  }
}

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    await configurarPermisos(strapi, 'public', accionesPorRol.public)
    await configurarPermisos(strapi, 'authenticated', accionesPorRol.authenticated)
    await crearContenidoInicial(strapi)
  },
}
