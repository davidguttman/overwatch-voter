const css = require('sheetify')
const choo = require('choo')

css('normalize.css')
css('tachyons')
css('./style.css', { global: true })

document.body.setAttribute('class', 'w-100 sans-serif bg-dark-gray white helvetica')

const app = choo()

app.model(require('./model'))

app.router((route) => [
  route('/', require('./views/main')),
  route('/maps', require('./views/maps')),
])

const tree = app.start()
document.body.appendChild(tree)
