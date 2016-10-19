const mapLimit = require('async/mapLimit')

const db = require('./db')
const heroes = require('./heroes')

module.exports = {
  fetchAll: function (data, state, send, done) {
    var combos = []
    heroes.forEach(function (asHero) {
      heroes.forEach(function (agHero) {
        if (asHero.name === agHero.name) return
        combos.push({asHero: asHero.name, agHero: agHero.name})
      })
    })

    mapLimit(combos, 16, getCombo, function (err, results) {
      if (err) return done(err)
      send('setRatings', results, done)
    })
  }
}

function getCombo (combo, cb) {
  var asHero = combo.asHero
  var agHero = combo.agHero

  db.getRating(asHero, agHero, function (err, rating) {
    if (err) return cb(err)

    cb(null, {
      asHero: asHero,
      againstHero: agHero,
      rating: (rating || {}).rating,
      count: (rating || {}).nVotes
    })
  })
}
