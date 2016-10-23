const effects = require('./effects')
const reducers = require('./reducers')

const maps = require('../data/maps')
const heroes = require('../data/heroes')

const state = {
  editTarget: null,
  heroCounters: {},
  heroMaps: {},
  loading: true,
  allMaps: maps,
  allHeroes: heroes,
  filteredMaps: maps,
  filteredHeroes: heroes,
  sortedMapHeroes: heroes,
  sortedCounterHeroes: heroes,
  searchTerm: ''
}

module.exports = {
  state: state,
  effects: effects,
  reducers: reducers
}
