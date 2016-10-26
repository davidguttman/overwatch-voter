var crypto = require('crypto')

var data = require('../dump/overwatch-voter-export.json')

var keys = Object.keys(data.heroMaps).filter(function (k) {
  return k.match(/^Genji/)
})

var rows = keys.map(function (k) {
  return data.heroMaps[k]
})

rows.forEach(fixRow)

console.log(JSON.stringify(data, null, 2))

function fixRow (row) {
  var counts = getRowCounts(row)

  var fCount = counts[1]

  for (var i = 0; i < fCount; i++) {
    row[getuid()] = { '.value': 5, '.priority': 5 }
    row[getuid()] = { '.value': 4, '.priority': 4 }
    row[getuid()] = { '.value': 3, '.priority': 3 }
    row[getuid()] = { '.value': 2, '.priority': 2 }
  }

  return row
}

function getRowCounts (row) {
  var counts = {1:0, 2:0, 3:0, 4:0, 5:0}
  Object.keys(row).forEach(function (uid) {
    var score = row[uid]['.value']
    counts[score] += 1
  })
  return counts
}

function getuid () {
  var buf = crypto.randomBytes(64).toString('base64')
  return buf.replace(/\W/g, '').slice(0,28)
}
