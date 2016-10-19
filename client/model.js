// const storage = require('./storage')
const effects = require('./effects')
const reducers = require('./reducers')
// const subscriptions = require('./subscriptions')

const state = {
  editTarget: null,
  heroCounters: {}
}

module.exports = {
  state,
  effects,
  reducers,
  // subscriptions
}
