const get = require('lodash/get')
const html = require('choo/html')

module.exports = function (opts, state, send) {
  var agents = opts.agents
  var combos = opts.combos
  var targets = opts.targets

  var onRate = opts.onRate
  var onSearch = opts.onSearch
  var onHighlight = opts.onHighlight

  return html`
    <table class='table table-header-rotated'>
      <thead>
        <tr>
          <th></th>
          ${agents.map(agent => html`
            <th class='rotate'>
              <div><span>${agent.name}</span></div>
            </th>
          `)}
        </tr>
      </thead>
      <tbody>
        ${targets.map(renderRow)}
      </tbody>
    </table>
  `

  function renderRow (target) {
    return html`
      <tr>
        <th
          onclick=${(e) => {
            target.name === state.searchTerm
            ? onSearch('')
            : onSearch(target.name)
          }}
          class='row-header pointer dim'>
          ${target.name}
        </th>
        ${agents.map((agent) => { return renderCell(agent, target) })}
      </tr>
    `
  }

  function renderCell (agent, target) {
    var value = '?'
    var style = ''
    if (target.name === agent.name) return html`<td></td>`

    var combo = get(combos, [agent.name, target.name])
    var displayRating

    if (combo) {
      displayRating = combo.localRating || combo.rating

      value = {5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F', undefined: '?', null: '?'}[displayRating]
      style = {
        5: 'white rank-a',
        4: 'light-gray rank-b',
        3: 'light-silver rank-c',
        2: 'light-gray rank-d',
        1: 'white rank-f',
        undefined: 'light-silver rank-c'
      }[displayRating]
    }

    return html`
      <td
        onclick=${(e) => onRate(combo)}
        onmouseover=${(e) => onHighlight(combo)}
        style='cursor: pointer'
        class=${'dim ' + style} >
        ${value}
      </td>
    `
  }
}
