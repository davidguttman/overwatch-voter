const get = require('lodash/get')
const html = require('choo/html')
const renderDistTable = require('./dist-table')

module.exports = function (state, prev, send) {
  var highlight = state.highlight
  var asHero = get(highlight, 'asHero')
  if (!asHero) return ''

  return html`
    <div class='pt3 light-gray'>
      <p class='f5'>
        <strong>${highlight.asHero}</strong>
        <span class='light-silver'>on</span>
        <br />
        ${highlight.map}
      </p>

      ${renderDistTable(highlight)}

      <p class='f6'>${highlight.count} ratings</p>
    </div>
  `
}
