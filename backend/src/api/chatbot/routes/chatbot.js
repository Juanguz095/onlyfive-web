'use strict'

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/chatbot/responder',
      handler: 'chatbot.responder',
      config: {
        auth: false,
      },
    },
  ],
}
