const CSV = require('csv-write-stream')
const get = require('lodash/get')
const html = require('choo/html')

module.exports = function (opts) {
  return html`
    <div class='f6 pt4 light-gray dim'>
      <a onclick=${click}>Export CSV</a>
    </div>
  `

  function click () {
    var type = opts.ratingType
    var agents = opts.agents
    var targets = opts.targets
    var combos = opts.combos

    var csv = CSV()
    var buf = ''
    csv.on('data', function (l) { buf += l })
    csv.on('end', function () {
      download(buf, `overwatch-counters-guide-${type}.csv`)
    })

    targets.forEach(function (target) {
      agents.forEach(function (agent) {
        var combo = get(combos, [agent.name, target.name]) || {}
        var dist = combo.dist || {}
        csv.write({
          type: type,
          agent: agent.name,
          target: target.name,
          median: combo.rating,
          A: dist[5],
          B: dist[4],
          C: dist[3],
          D: dist[2],
          F: dist[1]
        })
      })
    })

    csv.end()
  }
}

function download (content, filename, mime) {
  if (mime == null) mime = 'text/csv'

  var blob = new window.Blob([content], { type: mime })

  var a = document.createElement('a')
  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = [mime, a.download, a.href].join(':')

  var e = document.createEvent('MouseEvents')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false,
    false, false, 0, null)
  return a.dispatchEvent(e)
}
