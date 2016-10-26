var varhash = require('observ-varhash')
var firebase = require('firebase')
var AsyncCache = require('async-cache')

var ref = firebase.initializeApp({
  apiKey: 'AIzaSyDXaSdl2wNICfAOYXz68XWUuD55vG4CNuY',
  authDomain: 'overwatch-voter.firebaseapp.com',
  databaseURL: 'https://overwatch-voter.firebaseio.com',
  storageBucket: 'overwatch-voter.appspot.com',
  messagingSenderId: '1019798740074'
})

var uid
var loginCache = new AsyncCache({
  load: function (key, cb) {
    signIn(function (err, _uid) {
      if (err) return cb(err)
      uid = _uid
      cb(null, uid)
    })
  }
})

var ratingCounts = varhash({})

module.exports = {
  getTotalCounts: getTotalCounts,
  setCounterRating: loginify(setCounterRating),
  setMapRating: loginify(setMapRating),
  getCounterRating: getCounterRating,
  getMapRating: getMapRating
}

function createKey (agent, target) {
  return [agent, target].join('!')
}

function query (ref, _key, cb) {
  var key = _key.replace(/\./g, '')
  ref.database().ref().child(key).orderByPriority().once('value', function (snap) {
    cb(null, snap)
  }, cb)
}

function signIn (cb) {
  ref.auth().onAuthStateChanged(function (user) {
    if (!user) return ref.auth().signInAnonymously()

    cb(null, user.uid)
  })
}

function getTotalCounts (cb) {
  ratingCounts(function (allCounts) {
    var totalCount = 0
    for (var pairKey in allCounts) {
      totalCount += allCounts[pairKey]
    }
    cb(null, totalCount)
  })
}

function setCounterRating (agent, target, rating, cb) {
  if (!rating) return

  var pairKey = createKey(
    agent.replace(/\./g, ''),
    target.replace(/\./g, '')
  )

  window.localStorage.setItem(pairKey, rating)
  var ratingKey = ['heroCounters', pairKey, uid].join('/')
  ref
    .database()
    .ref()
    .child(ratingKey)
    .setWithPriority(rating, rating)
    .catch(cb)
    .then(function () { cb() })
}

function setMapRating (agent, target, rating, cb) {
  if (!rating) return

  var pairKey = createKey(
    agent.replace(/\./g, ''),
    target.replace(/\./g, '')
  )

  window.localStorage.setItem(pairKey, rating)
  var ratingKey = ['heroMaps', pairKey, uid].join('/')
  ref
    .database()
    .ref()
    .child(ratingKey)
    .setWithPriority(rating, rating)
    .catch(cb)
    .then(function () { cb() })
}

function getCounterRating (agent, target, cb) {
  getRating('heroCounters', agent, target, cb)
}

function getMapRating (agent, target, cb) {
  getRating('heroMaps', agent, target, cb)
}

function getRating (type, agent, target, cb) {
  var pairKey = createKey(agent, target)
  var localStr = window.localStorage.getItem(pairKey)
  var local = localStr ? parseFloat(localStr) : null

  var childKey = [type, pairKey].join('/')
  query(ref, childKey, function (err, snap) {
    if (err) return cb(err)

    var n = snap.numChildren()
    var result = {
      localRating: local,
      rating: local,
      nVotes: n,
      dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }

    if (n === 0) return cb(null, result)

    ratingCounts.put(pairKey, n)

    var i = 0
    var mid = Math.floor(n / 2)
    snap.forEach(function (cSnap) {
      if (i === mid) result.rating = cSnap.val()
      result.dist[cSnap.val()] += 1
      i++
    })

    cb(null, result)
  })
}

function loginify (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    loginCache.get('a', function (err) {
      if (err) return console.error(err)
      fn.apply(null, args)
    })
  }
}
