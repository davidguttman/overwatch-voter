const fuzzysearch = require('fuzzysearch')

module.exports = function (needle, haystack) {
  var needles = needle.split(/,\s?/).map((n) => n.toLowerCase())

  var didMatch = false
  needles.forEach(function (n) {
    if (fuzzysearch(n, haystack.toLowerCase())) didMatch = true
  })

  return didMatch
}
