var set = require('lodash/set')
module.exports = {
  setRatings: (ratingList, state) => {
    var heroCounters = {}
    ratingList.forEach(function (combo) {
      set(heroCounters, [combo.asHero, combo.againstHero], combo)
    })
    state.heroCounters = heroCounters
    return state
  }
}
