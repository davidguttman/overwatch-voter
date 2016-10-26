const html = require('choo/html')

const renderEdit = require('./edit')
const renderTable = require('./table')
const renderHeader = require('./header')
const renderSearch = require('./search')
const renderLoading = require('./loading')
const renderInstructions = require('./instructions')
const renderDistribution = require('./distribution')

var fetched = false
module.exports = function (state, prev, send) {
  if (!fetched) {
    fetched = true
    send('fetchAllMaps')
  }

  return render()

  function render () {
    return html`
      <main class="cf pa3 pa4-m pa5-l mw9 center">
        ${state.loading ? renderLoading() : ''}

        ${state.editTarget ? renderEdit(state, prev, send) : ''}
        ${renderHeader()}

        <div>
          <div class='fl w-25 pa2 pt6 light-gray'>
            ${renderInstructions()}
            ${renderSearch(state, prev, send)}
            ${renderDistribution(state, prev, send)}
          </div>

          <div class='fl w-75 pa2'>
            ${renderTable(state, prev, send)}
          </div>
        </div>

      </main>
    `
  }
}
