const _ = require('lodash')
const jsdoc = require('jsdoc-api')

const renderers = require('./renderers')
const actions = require('./actions')
h
module.exports = bp => {
  // register renderers
  // Register all renderers
    Object.keys(renderers).forEach(name => {
      bp.renderers.register(name, renderers[name])
    })

  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {
    event.reply('#welcome')
  })

    ////////////////////////////
    /// Conversation Management
    ////////////////////////////


    // All events that should be processed by the Flow Manager
    bp.hear({ type: /text|message|quick_reply/i }, (event, next) => {
      bp.dialogEngine.processMessage(event.sessionId || event.user.id, event).then()
    })
  // You can also pass a matcher object to better filter events
  bp.hear(
    {
      type: /message|text/i,
      text: /exit|bye|goodbye|quit|done|leave|stop/i
    },
    (event, next) => {
      event.reply('#goodbye', {
        reason: 'unknown'
      })
    }
  )
}
