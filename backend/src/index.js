'use strict'

const accionesPorRol = {
  public: [
    'api::publicacion.publicacion.find',
    'api::publicacion.publicacion.findOne',
    'api::chatbot.chatbot.responder',
  ],
  authenticated: [
    'api::publicacion.publicacion.find',
    'api::publicacion.publicacion.findOne',
    'api::publicacion.publicacion.create',
    'api::publicacion.publicacion.mias',
    'api::portafolio.portafolio.find',
    'api::portafolio.portafolio.findOne',
    'api::portafolio.portafolio.create',
    'api::chatbot.chatbot.responder',
  ],
}

const esPermisoDelProyecto = (accion) => (
  accion.startsWith('api::publicacion.') ||
  accion.startsWith('api::portafolio.') ||
  accion.startsWith('api::chatbot.') ||
  accion.startsWith('api::conversacion-chat.') ||
  accion.startsWith('api::mensaje-chat.')
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

    return
  }

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

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await configurarPermisos(strapi, 'public', accionesPorRol.public)
    await configurarPermisos(strapi, 'authenticated', accionesPorRol.authenticated)
    await crearContenidoInicial(strapi)
  },
}
