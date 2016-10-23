const mapLimit = require('async/mapLimit')

const db = require('../db')
const maps = require('../data/maps')
const heroes = require('../data/heroes')

module.exports = {
  fetchAllCounters: function (data, state, send, done) {
    var combos = []
    heroes.forEach(function (agHero) {
      heroes.forEach(function (asHero) {
        if (asHero.name === agHero.name) return
        combos.push({asHero: asHero.name, agHero: agHero.name})
      })
    })

    mapLimit(combos, 64, spy, function (err, results) {
      if (err) return done(err)
      send('setCounterRatings', results, done)
    })

    function spy (combo, cb) {
      getCounterCombo(combo, function (err, res) {
        if (err) return cb(err)
        cb(null, res)
        send('setCounterRating', res, function () {})
      })
    }
  },

  fetchAllMaps: function (data, state, send, done) {
    var combos = []
    maps.forEach(function (map) {
      heroes.forEach(function (asHero) {
        combos.push({asHero: asHero.name, map: map.name})
      })
    })

    mapLimit(combos, 64, spy, function (err, results) {
      if (err) return done(err)
      send('setMapRatings', results, done)
    })

    function spy (combo, cb) {
      getMapCombo(combo, function (err, res) {
        if (err) return cb(err)
        cb(null, res)
        send('setMapRating', res, function () {})
      })
    }
  },

  rateCounterCombo: function (data, state, send, done) {
    send('setCounterRating', data, function () { })

    db.setCounterRating(data.asHero, data.againstHero, data.rating, function (err) {
      if (err) return done(err)
      send('cancelEditCombo', null, done)
    })
  },

  rateMapCombo: function (data, state, send, done) {
    send('setMapRating', data, function () { })

    db.setMapRating(data.asHero, data.map, data.rating, function (err) {
      if (err) return done(err)
      send('cancelEditCombo', null, done)
    })
  }
}

function getCounterCombo (combo, cb) {
  var asHero = combo.asHero
  var agHero = combo.agHero

  db.getCounterRating(asHero, agHero, function (err, rating) {
    if (err) return cb(err)

    cb(null, {
      asHero: asHero,
      againstHero: agHero,
      rating: (rating || {}).rating,
      count: (rating || {}).nVotes
    })
  })
}

function getMapCombo (combo, cb) {
  var asHero = combo.asHero
  var map = combo.map

  db.getMapRating(asHero, map, function (err, rating) {
    if (err) return cb(err)

    cb(null, {
      asHero: asHero,
      map: map,
      rating: (rating || {}).rating,
      count: (rating || {}).nVotes
    })
  })
}
