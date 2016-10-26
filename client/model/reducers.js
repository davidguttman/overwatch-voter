var get = require('lodash/get')
var set = require('lodash/set')
var sortBy = require('lodash/sortBy')
var fSearch = require('../fuzzysearch')

module.exports = {
  setCounterRatings: (ratingList, state) => {
    var heroCounters = {}
    ratingList.forEach(function (combo) {
      set(heroCounters, [combo.asHero, combo.againstHero], combo)
    })
    state.heroCounters = heroCounters
    state.loading = false
    return state
  },

  setCounterRating: (rating, state) => {
    var path = [rating.asHero, rating.againstHero, 'rating']
    set(state.heroCounters, path, rating.rating)
    return state
  },

  setMapRatings: (ratingList, state) => {
    var heroMaps = {}
    ratingList.forEach(function (combo) {
      set(heroMaps, [combo.agent, combo.target], combo)
    })
    state.heroMaps = heroMaps
    state.loading = false
    return state
  },

  setMapRating: (rating, state) => {
    var path = [rating.agent, rating.target, 'rating']
    set(state.heroMaps, path, rating.rating)
    return state
  },

  startEditCombo: function (combo, state) {
    state.editTarget = combo
    return state
  },

  cancelEditCombo: function (combo, state) {
    state.editTarget = null
    return state
  },

  setSearchTerm: function (term, state) {
    state.searchTerm = term

    state.filteredHeroes = state.allHeroes.filter((h) => fSearch(term, h.name))
    state.filteredMaps = state.allMaps.filter((m) => fSearch(term, m.name))

    if (state.filteredMaps.length === 1) {
      state.sortedMapHeroes = sortBy(state.allHeroes, function (asHero) {
        var map = state.filteredMaps[0]
        var r = get(state.heroMaps, [asHero.name, map.name, 'rating'])
        return -1 * (r || 3)
      })
    } else { state.sortedMapHeroes = state.allHeroes }

    if (state.filteredHeroes.length === 1) {
      state.sortedCounterHeroes = sortBy(state.allHeroes, function (asHero) {
        var agHero = state.filteredHeroes[0]
        var r = get(state.heroCounters, [asHero.name, agHero.name, 'rating'])
        return -1 * (r || 3)
      })
    } else { state.sortedCounterHeroes = state.allHeroes }

    return state
  },

  setHighlight: function (combo, state) {
    state.highlight = combo
    return state
  }
}
