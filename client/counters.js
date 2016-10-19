var _ = require('lodash')
var data = require('./counter-data.json')

var strength = module.exports = {}

Object.keys(data).forEach(function (heroName) {
  strength[heroName] = strength[heroName] || {}

  var weakAgainst = data[heroName].weakAgainst
  var strongAgainst = data[heroName].strongAgainst

  weakAgainst.forEach(function (waHero) {
    _.set(strength, [heroName, waHero], 'F')
    if (!_.get(strength, [waHero, heroName])) {
      _.set(strength, [waHero, heroName], 'B')
    }
  })

  strongAgainst.forEach(function (saHero) {
    if (saHero === '-') return

    strength[heroName][saHero] = 'A'

    if (!_.get(strength, [saHero, heroName])) {
      _.set(strength, [saHero, heroName], 'D')
    }
  })
})
