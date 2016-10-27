const CSV = require('csv-write-stream')
const html = require('choo/html')

const renderEdit = require('./components/edit')
const renderTable = require('./components/table')
const renderHeader = require('./components/header')
const renderSearch = require('./components/search')
const renderLoading = require('./components/loading')
const renderInstructions = require('./components/instructions')
const renderDistribution = require('./components/distribution')

var fetched = false
module.exports = function (state, prev, send) {
  if (!fetched) {
    fetched = true
    send('fetchAllCounters')
  }

  var tableOpts = {
    ratingType: 'counterpicks',
    agents: state.sortedCounterHeroes,
    targets: state.filteredHeroes,
    combos: state.heroCounters,
    onSearch: search,
    onRate: (combo) => send('startEditCombo', combo),
    onHighlight: (combo) => send('setHighlight', combo)
  }

  return render()

  function render () {
    return html`
      <main class="cf pa3 pa4-m pa5-l mw9 center">
        ${state.loading ? renderLoading() : ''}

        ${edit(state, send)}
        ${renderHeader()}

        <div>
          <div class='fl w-25 pa2 pt6 light-gray'>
            ${renderInstructions(instructions())}
            ${renderSearch(state.searchTerm, search)}
            ${renderDistribution(state.highlight, 'counters')}
          </div>

          <div class='fl w-75 pa2'>
            ${renderTable(tableOpts, state, send)}

            ${renderExport(tableOpts)}
          </div>


        </div>

      </main>
    `
  }

  function search (term) { send('setSearchTerm', term) }
}

function edit (state, send) {
  if (!state.editTarget) return ''

  var agent = state.editTarget.agent
  var target = state.editTarget.target

  return renderEdit(agent, target, 'to counter', function (rating) {
    if (!rating) return send('cancelEditCombo')

    send('rateCounterCombo', {
      agent: rating.agent,
      target: rating.target,
      rating: rating.rating
    })
  })
}

function instructions () {
  return [
    `First, find the hero you'd like to counter along the left edge. Then, note the strength rating of each column's hero in that row.`,
    `For example, if you'd like to counter Bastion, find the 7th row, and then note that Genji has an "A" rating in the first column.`
  ]
}

const get = require('lodash/get')
function renderExport (opts) {
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
    csv.on('end', function () { download(buf, `${type}.csv`) })

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
