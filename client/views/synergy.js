const html = require('choo/html')

const renderEdit = require('./components/edit')
const renderTable = require('./components/table')
const renderHeader = require('./components/header')
const renderSearch = require('./components/search')
const renderExport = require('./components/export')
const renderLoading = require('./components/loading')
const renderInstructions = require('./components/instructions')
const renderDistribution = require('./components/distribution')

var fetched = false
module.exports = function (state, prev, send) {
  if (!fetched) {
    fetched = true
    send('fetchAllSynergy')
  }

  var tableOpts = {
    ratingType: 'synergy',
    agents: state.sortedSynergyHeroes,
    targets: state.filteredHeroes,
    combos: state.heroSynergy,
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
            ${renderDistribution(state.highlight, 'compliments')}
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

  return renderEdit(agent, target, 'to compliment', function (rating) {
    if (!rating) return send('cancelEditCombo')

    send('rateSynergyCombo', {
      agent: rating.agent,
      target: rating.target,
      rating: rating.rating
    })
  })
}

function instructions () {
  return [
    `First, find the hero you'd like to compliment along the left edge. Then, note the strength rating of each column's hero in that row.`,
    `For example, if you'd like to compliment Reaper, find the Ana's row, and then note that she has an "A" rating in her column.`
  ]
}
