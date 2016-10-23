const fuzzysearch = require('fuzzysearch')

module.exports = function (needle, haystack) {
  return fuzzysearch(needle.toLowerCase(), haystack.toLowerCase())
}
