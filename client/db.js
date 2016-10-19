var varhash = require('observ-varhash')
var firebase = require('firebase')
var AsyncCache = require('async-cache')

var ref = firebase.initializeApp({
    apiKey: "AIzaSyDXaSdl2wNICfAOYXz68XWUuD55vG4CNuY",
    authDomain: "overwatch-voter.firebaseapp.com",
    databaseURL: "https://overwatch-voter.firebaseio.com",
    storageBucket: "overwatch-voter.appspot.com",
    messagingSenderId: "1019798740074"
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

var db = module.exports = {
  getTotalCounts: getTotalCounts,
  setRating: loginify(setRating),
  getRating: getRating
}

function createKey (asHero, againstHero) {
  return [asHero, againstHero].join('!')
}

function query (ref, _key, cb) {
  var key = _key.replace(/\./g, '')
  ref.database().ref().child(key).orderByPriority().once('value', function(snap) {
    cb(null, snap)
  }, cb)
}

function signIn (cb) {
  ref.auth().onAuthStateChanged(function(user) {
    if (!user) return ref.auth().signInAnonymously()

    cb(null, user.uid)
  })
}

function getTotalCounts (cb) {
  ratingCounts(function(allCounts) {
    var totalCount = 0
    for (var pairKey in allCounts) {
      totalCount += allCounts[pairKey]
    }
    cb(null, totalCount)
  })
}

function setRating (asHero, againstHero, rating, cb) {
  if (!rating) return

  var pairKey = createKey(
    asHero.replace(/\./g, ''),
    againstHero.replace(/\./g, '')
  )

  localStorage.setItem(pairKey, rating)
  var ratingKey = ['heroCounters', pairKey, uid].join('/')
  ref
    .database()
    .ref()
    .child(ratingKey)
    .setWithPriority(rating, rating)
    .catch(cb)
    .then(function () { cb() })
}

function getRating (asHero, againstHero, cb) {
  var pairKey = createKey(asHero, againstHero)
  var local = localStorage.getItem(pairKey)

  var childKey = ['heroCounters', pairKey].join('/')
  query(ref, childKey, function(err, snap) {
    if (err) return cb(err)

    var n = snap.numChildren()
    if (local) return cb(null, {
      rating: parseFloat(local),
      nVotes: n
    })

    if (n === 0) return cb(null)

    ratingCounts.put(pairKey, n)

    var i = 0
    var mid = Math.floor(n/2)
    snap.forEach(function(cSnap) {
      if (i === mid) {
        cb(null, {
          rating: cSnap.val(),
          nVotes: n
        })

        return true
      }
      i += 1
    })
  })
}

function loginify (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    loginCache.get('a', function (err) {
      fn.apply(null, args)
    })
  }
}
