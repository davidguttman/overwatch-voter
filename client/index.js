const css = require('sheetify')
const choo = require('choo')

const db = require('./db')
const maps = require('./maps')

const model = require('./model')
const mainView = require('./main')

css('normalize.css')
css('tachyons')
css('./style.css', { global: true })

const app = choo()

app.model(model)

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
