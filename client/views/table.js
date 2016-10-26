const get = require('lodash/get')
const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <table class='table table-header-rotated'>
      <thead>
        <tr>
          <th></th>
          ${state.sortedMapHeroes.map(h => html`
            <th class='rotate'>
              <div><span>${h.name}</span></div>
            </th>
          `)}
        </tr>
      </thead>
      <tbody>
        ${state.filteredMaps.map(renderRow)}
      </tbody>
    </table>
  `

  function renderRow (map) {
    return html`
      <tr>
        <th
          onclick=${(e) => {
            if (map.name === state.searchTerm) {
              send('setSearchTerm', '')
            } else {
              send('setSearchTerm', map.name)
            }
          }}
          class='row-header pointer dim'>
          ${map.name}
        </th>
        ${state.sortedMapHeroes.map((asHero, j) => {
          return renderCell(asHero, map)
        })}
      </tr>
    `
  }

  function renderCell (asHero, map) {
    var value = '?'
    var style = ''
    if (map.name === asHero.name) return html`<td></td>`

    var combo = {
      asHero: asHero.name,
      map: map.name
    }

    var rating = get(state.heroMaps, [asHero.name, map.name])
    var displayRating

    if (rating) {
      displayRating = rating.localRating || rating.rating

      value = {5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F', undefined: '?'}[displayRating]
      style = {
        5: 'white rank-a',
        4: 'light-gray rank-b',
        3: 'light-silver rank-c',
        2: 'light-gray rank-d',
        1: 'white rank-f',
        undefined: 'light-silver rank-c'
      }[displayRating]
    }

    var nVotes = (rating || {}).count || 0

    return html`
      <td
        onclick=${(e) => send('startEditCombo', combo)}
        onmouseover=${(e) => send('setHighlight', rating)}
        style='cursor: pointer'
        title='${asHero.name} on ${map.name} (${nVotes} ratings)'
        class=${'dim ' + style} >
        ${value}
      </td>
    `
  }
}
