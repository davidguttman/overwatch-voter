var set = require('lodash/set')
module.exports = {
  setRatings: (ratingList, state) => {
    var heroCounters = {}
    ratingList.forEach(function (combo) {
      set(heroCounters, [combo.asHero, combo.againstHero], combo)
    })
    state.heroCounters = heroCounters
    return state
  },

  setRating: (rating, state) => {
    var path = [rating.asHero, rating.againstHero, 'rating']
    set(state.heroCounters, path, rating.rating)
    return state
  },

  startEditCombo: function (combo, state) {
    state.editTarget = combo
    return state
  },

  cancelEditCombo: function (combo, state) {
    state.editTarget = null
    return state
  }
}
