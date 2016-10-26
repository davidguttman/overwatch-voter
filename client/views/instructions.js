const html = require('choo/html')

module.exports = function () {
  return html`
    <div>
      <h3 class='f3'>How to read this chart:</h3>
      <p class='f6 measure-narrow 1h-copy'>
        First, find the map you'd like to play along the left edge. Then, note the strength rating of each column's hero in that row.
      </p>
      <p class='f6 measure-narrow 1h-copy'>
        For example, if you'd like to play Temple of Anubis - Attack, find the 4th row, and then note that Ana has an "A" rating in her column.
      </p>
    </div>
  `
}
