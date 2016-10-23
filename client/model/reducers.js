var set = require('lodash/set')
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
      set(heroMaps, [combo.asHero, combo.map], combo)
    })
    state.heroMaps = heroMaps
    state.loading = false
    return state
  },

  setMapRating: (rating, state) => {
    var path = [rating.asHero, rating.map, 'rating']
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
    return state
  }
}
