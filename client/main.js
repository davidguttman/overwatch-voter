const get = require('lodash/get')
const html = require('choo/html')

const heroes = require('./heroes')
const counters = require('./counters')

var fetched = false
const mainView = module.exports = function (state, prev, send) {
  if (!fetched) {
    fetched = true
    send('fetchAll')
  }

  return render()

  function render () {
    return html`
      <main
        class="cf pa3 pa4-m pa5-l mw9 center" >
        ${renderHeader()}
        ${ state.editTarget ? renderEdit() : renderTable()}
      </main>
    `
  }

  function renderHeader () {
    return html`
      <article class="mw7 center ph3 ph5-ns tc br2 pv5 bg-washed-blue dark-green">
        <h1 class="fw6 f3 f2-ns lh-title mt0 mb3">
          Overwatch Counters Guide
        </h1>
        <h2 class="fw2 f4 lh-copy mt0 mb3">
          If you need to counter a hero, first find that hero's row.
          <br>
          Then, choose a column with a strong rating.
        </h2>
        <p class="fw1 f5 mt0 mb3">
          For example, to counter Genji:
          <br>
          The first row shows that Mei is a strong pick with an "A" rating.
        </p>
      </article>
    `
  }

  function renderEdit () {
    var asHero = state.editTarget.asHero
    var againstHero = state.editTarget.againstHero
    var letterStyle = "f1 link grow b no-underline black dib ph2 pv1"

    function rate (rating) {
      send('rateCombo', {
        asHero: asHero,
        againstHero: againstHero,
        rating: rating
      })
    }

    return html`
      <div class='tc'>
        <div class='f1 center'>
          How would you rate <strong>${asHero}'s</strong> ability to counter <strong>${againstHero}</strong>?
        </div>

        <section class="pa3 pa4-m pa5-l center">
          <a
            onclick=${(e) => rate(5)}
            class=${'hover-green ' + letterStyle} >
            A
          </a>
          <a
            onclick=${(e) => rate(4)}
            class=${'hover-light-green ' + letterStyle} >
            B
          </a>
          <a
            onclick=${(e) => rate(3)}
            class=${'hover-gray ' + letterStyle} >
            C
          </a>
          <a
            onclick=${(e) => rate(2)}
            class=${'hover-light-red ' + letterStyle} >
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
    return html`
      <div>
        <table class='table table-header-rotated'>
          <thead>
            <tr>
              <th></th>
              ${heroes.map( h => html`
                <th class='rotate'>
                  <div><span>${h.name}</span></div>
                </th>
              ` )}
            </tr>
          </thead>
          <tbody>
            ${heroes.map(renderRow)}
          </tbody>
        </table>
      </div>
    `
  }

  function renderRow (agHero) {
    return html`
      <tr>
        <th class='row-header'>${agHero.name}</th>
          ${heroes.map( (asHero, j) => {
            return renderCell(asHero, agHero)
          } )}
      </tr>
    `
  }

  function renderCell (asHero, agHero) {
    var value = ''
    var style = 'bg-light-gray'
    if (agHero.name === asHero.name) return html`<td></td>`

    var combo = {
      asHero: asHero.name,
      againstHero: agHero.name
    }

    var rating = get(state.heroCounters, [asHero.name, agHero.name])

    if (rating) {
      value = {5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F'}[rating.rating]
      style = {
        5: 'bg-light-green',
        4: 'bg-washed-green',
        2: 'bg-washed-red',
        1: 'bg-light-red'
      }[rating.rating] || 'bg-light-gray'
    }

    var nVotes = (rating || {}).count || 0

    return html`
      <td
        onclick=${(e) => send('startEditCombo', combo)}
        style='cursor: pointer'
        title='${asHero.name} countering ${agHero.name} (${nVotes} votes)'
        class=${'dim ' + style} >
        ${value}
      </td>
    `
  }
}
