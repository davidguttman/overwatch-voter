const html = require('choo/html')

module.exports = function () {
  return html`
    <div>
      <div class='fl w-25 pa2'></div>
      <div class="fl w-75 pa2">
        <p class="f6">
          Overwatch Counters Guide
        </p>
        <h1 class="f2 f1-l lh-title mt0 mb3">
          Choose the right hero for the job.
        </h1>
        <nav class="mw7 mt2">
          <a
            class="f6 f5-l link white-80 dib pr3 dim"
            href="/counters" >
            Counterpicks
          </a>
          <a
            class="f6 f5-l link white-80 dib pr3 dim"
            href="/maps" >
            Maps
          </a>
        </nav>
      </div>

    </div>
  `
}
