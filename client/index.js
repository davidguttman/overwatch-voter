const css = require('sheetify')
const choo = require('choo')

css('normalize.css')
css('tachyons')
css('./style.css', { global: true })

document.body.setAttribute('class', 'w-100 sans-serif bg-dark-gray white helvetica')

const app = choo()

app.model(require('./model'))

app.router((route) => [
  route('/', redirect('/counters')),
  route('/counters', require('./views/counters')),
  route('/maps', require('./views/maps')),
  route('/synergy', require('./views/synergy')),
])

const tree = app.start()
document.body.appendChild(tree)

function redirect (path) {
  return function (state, prev, send) {
    history.pushState({}, '', path)
    send('location:setLocation', { location: path })
    return document.createElement('div')
  }
}
