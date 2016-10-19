const html = require('choo/html')

const heroes = require('./heroes')
const counters = require('./counters')

const mainView = module.exports = (state, prev, send) => html`
  <main class="cf pa3 pa4-m pa5-l mw9 center">
    ${renderHeader()}
    ${renderTable()}
  </main>
`

function renderHeader () {
  return html`
    <article class="mw7 center ph3 ph5-ns tc br2 pv5 bg-washed-blue dark-green mb5">
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
  if (agHero.name === asHero.name) value = ''

  var rating = counters[asHero.name][agHero.name]
  if (rating) {
    value = rating
    style = {
      A: 'bg-light-green',
      B: 'bg-washed-green',
      D: 'bg-washed-red',
      F: 'bg-light-red'
    }[rating]
  }

  return html` <td class=${style}>${value}</td> `
}
