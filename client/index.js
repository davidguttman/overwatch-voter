const css = require('sheetify')
const choo = require('choo')

css('normalize.css')
css('tachyons')
css('./style.css', { global: true })

const app = choo()

app.model(require('./model'))

app.router((route) => [
  route('/', require('./views/main'))
])

const tree = app.start()
document.body.appendChild(tree)
