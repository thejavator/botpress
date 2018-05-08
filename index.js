/*
  CONGRATULATIONS on creating your first Botpress bot!

  This is the programmatic entry point of your bot.
  Your bot's logic resides here.

  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Install a connector module (Facebook Messenger and/or Slack)
  3. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/
const _ = require('lodash')
const nlu = require('./node_modules/@botpress/nlu')
const jsdoc = require('jsdoc-api')
const renderers = require('./renderers.js')
const actions = require('./actions.js')

module.exports = bp => {
  Object.keys(renderers).forEach(name => {
    bp.renderers.register(name, renderers[name])
  })

  jsdoc.explain({ files: [__dirname + '/actions.js'] }).then(docs => {
    bp.dialogEngine.setFunctionMetadataProvider(fnName => {
      const meta = docs.find(({ name }) => name === fnName)
      return {
        desciption: meta.description,
        params: (meta.params || [])
          .filter(({ name }) => name.startsWith('args.'))
          .map(arg => ({ ...arg, name: arg.name.replace('args.', '') }))
      }
    })
    bp.dialogEngine.registerFunctions(actions)
  })

  bp.hear({ type: /text|message/i }, (event, next) => {
    bp.dialogEngine.processMessage(event.sessionId || event.user.id, event).then()
  })
  // You can also pass a matcher object to better filter events
}
