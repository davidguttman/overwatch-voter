const css = require('sheetify')
const choo = require('choo')
const html = require('choo/html')

const db = require('./db')
const maps = require('./maps')
const heroes = require('./heroes')
const counters = require('./counters')

var heroNames = Object.keys(counters)
heroNames.forEach(function (asHero, i) {
  heroNames.forEach(function (agHero) {
    var rating = counters[asHero][agHero]
    if (!rating) return

    var score = { A: 5, B: 4, C: 3, D: 2, F: 1 }[rating]

    setTimeout(function () {
      db.setRating(asHero, agHero, score, function (err) {
        if (err) return console.error(err)
      })
    }, i * 1000)
  })
})

db.getRating('Pharah', 'McCree', function (err, rating) {
  if (err) return console.error(err)
  console.log('rating', rating)
})

css('normalize.css')
css('tachyons')
css('./style.css', { global: true })

const app = choo()

app.model({
  state: { title: 'Not quite set yet' },
  reducers: {
    update: (data, state) => ({ title: data })
  }
})

const mainView = (state, prev, send) => html`
  <main class="cf pa3 pa4-m pa5-l mw9 center">
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

    <div>
      <table class='table table-header-rotated center'>
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
          ${heroes.map( (agHero, i) => {
            return html`
              <tr>
                <th class='row-header'>${agHero.name}</th>
                  ${heroes.map( (asHero, j) => {
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
                  } )}
              </tr>
            `
          } )}
        </tbody>
      </table>
    </div>

  </main>
`

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
