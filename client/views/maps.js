const get = require('lodash/get')
const html = require('choo/html')
const fSearch = require('../fuzzysearch')

const maps = require('../data/maps')
const heroes = require('../data/heroes')
const renderHeader = require('./header')

var fetched = false
const mainView = module.exports = function (state, prev, send) {
  if (!fetched) {
    fetched = true
    send('fetchAllMaps')
  }

  return render()

  function render () {
    return html`
      <main class="cf pa3 pa4-m pa5-l mw9 center">
        ${ state.loading ? renderLoading() : '' }

        ${ state.editTarget
          ? renderEdit()
          : html`
            <div>
              ${ renderHeader() }
              ${ renderTable() }
            </div>
          `
        }
      </main>
    `
  }

  function renderLoading () { return html`<div class='spinner'></div>` }

  function renderEdit () {
    var asHero = state.editTarget.asHero
    var map = state.editTarget.map
    var letterStyle = "f1 link grow b no-underline dib ph2 pv1"

    function rate (rating) {
      send('rateMapCombo', {
        asHero: asHero,
        map: map,
        rating: rating
      })
    }

    return html`
      <div class='tc'>
        <div class='f1 center'>
          How would you rate <strong>${asHero}'s</strong> ability on <strong>${map}</strong>?
        </div>

        <section class="pa3 pa4-m pa5-l center">
          <a
            onclick=${(e) => rate(5)}
            class=${'hover-green ' + letterStyle} >
            A
          </a>
          <a
            onclick=${(e) => rate(4)}
            class=${'hover-dark-green ' + letterStyle} >
            B
          </a>
          <a
            onclick=${(e) => rate(3)}
            class=${'hover-gray ' + letterStyle} >
            C
          </a>
          <a
            onclick=${(e) => rate(2)}
            class=${'hover-dark-red ' + letterStyle} >
            D
          </a>
          <a
            onclick=${(e) => rate(1)}
            class=${'hover-red ' + letterStyle} >
            F
          </a>
        </section>

        <section class="pa3 pa4-m pa5-l center">
          <a
            onclick=${(e) => send('cancelEditCombo')}
            class="f3 gray dim">
            Cancel
          </a>
        </section>
      </div>
    `
  }

  function renderTable () {
    var term = state.searchTerm
    
    return html`
      <div class=''>
        <article class='fl w-25 pa2 pt6'>
          <h3 class='f3'>How to read this chart:</h3>
          <p class='f6 measure-narrow 1h-copy'>
            First, find the map you'd like to play along the left edge. Then, note the strength rating of each column's hero in that row.
          </p>
          <p class='f6 measure-narrow 1h-copy'>
            For example, if you'd like to play Temple of Anubis - Attack, find the 4th row, and then note that Ana has an "A" rating in her column.
          </p>

          <input
            type='text'
            value=${state.searchTerm}
            placeholder='Search'
            onkeyup=${search}
            class='${term ? 'light-gray' : 'gray'} bg-dark-gray ba pa2 mt3' />

          <span>
            ${ !term ? '' : html`
              <a
                onclick=${(e) => send('setSearchTerm', '')}
                class='f6 dim light-gray pa2'>
                Clear
              </a>
            `}
          </span>
        </article>

        <div class='fl w-75 pa2'>
          <table class='table table-header-rotated'>
            <thead>
              <tr>
                <th></th>
                ${state.sortedMapHeroes.map( h => html`
                  <th class='rotate'>
                    <div><span>${h.name}</span></div>
                  </th>
                ` )}
              </tr>
            </thead>
            <tbody>
              ${ state.filteredMaps.map(renderRow) }
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  function renderRow (map) {
    return html`
      <tr>
        <th
          onclick=${(e) => send('setSearchTerm', map.name)}
          class='row-header pointer dim'>
          ${map.name}
        </th>
        ${state.sortedMapHeroes.map( (asHero, j) => {
          return renderCell(asHero, map)
        } )}
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

    if (rating) {
      value = {5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F', undefined: '?'}[rating.rating]
      style = {
        5: 'white rank-a',
        4: 'light-gray rank-b',
        3: 'light-silver rank-c',
        2: 'light-gray rank-d',
        1: 'white rank-f',
        undefined: 'light-silver rank-c',
      }[rating.rating]
    }

    var nVotes = (rating || {}).count || 0

    return html`
      <td
        onclick=${(e) => send('startEditCombo', combo)}
        style='cursor: pointer'
        title='${asHero.name} on ${map.name} (${nVotes} votes)'
        class=${'dim ' + style} >
        ${value}
      </td>
    `
  }

  function search (evt) {
    send('setSearchTerm', evt.target.value)
  }
}
