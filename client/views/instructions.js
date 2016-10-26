const html = require('choo/html')

module.exports = function (paras) {
  return html`
    <div>
      <h3 class='f3'>How to read this chart:</h3>
      ${paras.map((text) => html`
        <p class='f6 measure-narrow 1h-copy'>${text}</p>
      `)}
    </div>
  `
}
