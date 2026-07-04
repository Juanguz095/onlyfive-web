'use strict'

const crearRespuesta = (texto) => {
  const consulta = texto.toLowerCase()

  if (consulta.includes('admision') || consulta.includes('admision') || consulta.includes('requisito')) {
    return 'Para admision necesitas DNI, certificado de estudios, fotos y completar el proceso indicado por el instituto.'
  }

  if (consulta.includes('horario') || consulta.includes('taller')) {
    return 'Los horarios y talleres se publican por ciclo. Puedes revisar las actividades o consultar directamente en coordinacion academica.'
  }

  if (consulta.includes('actividad') || consulta.includes('proyecto')) {
    return 'Las actividades de estudiantes se muestran en esta pagina y se cargan desde las publicaciones publicadas del portafolio.'
  }

  if (consulta.includes('carrera') || consulta.includes('cocina')) {
    return 'El Programa de Cocina forma estudiantes en tecnicas culinarias, talleres practicos, proyectos integradores y portafolio academico.'
  }

  return 'Gracias por tu consulta. Puedo ayudarte con informacion de la carrera, admision, horarios, talleres y actividades de estudiantes.'
}

module.exports = {
  async responder(ctx) {
    const texto = String(ctx.request.body?.texto || '').trim()
    const conversacionId = ctx.request.body?.conversacionId

    if (!texto) {
      return ctx.badRequest('El mensaje es obligatorio')
    }

    let conversacion

    if (conversacionId) {
      conversacion = await strapi.entityService.findOne('api::conversacion-chat.conversacion-chat', conversacionId)
    }

    if (!conversacion) {
      conversacion = await strapi.entityService.create('api::conversacion-chat.conversacion-chat', {
        data: {
          identificador: `chat-${Date.now()}`,
          nombre_visitante: 'Visitante',
        },
      })
    }

    await strapi.entityService.create('api::mensaje-chat.mensaje-chat', {
      data: {
        texto,
        emisor: 'usuario',
        conversacion: conversacion.id,
      },
    })

    const respuesta = crearRespuesta(texto)

    const mensajeBot = await strapi.entityService.create('api::mensaje-chat.mensaje-chat', {
      data: {
        texto: respuesta,
        emisor: 'bot',
        conversacion: conversacion.id,
      },
    })

    ctx.body = {
      conversacionId: conversacion.id,
      mensaje: {
        id: mensajeBot.id,
        tipo: 'bot',
        texto: respuesta,
      },
    }
  },
}
