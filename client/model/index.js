const effects = require('./effects')
const reducers = require('./reducers')

const state = {
  editTarget: null,
  heroCounters: {},
  // loading: true
}

module.exports = {
  state: state,
  effects: effects,
  reducers: reducers
}
