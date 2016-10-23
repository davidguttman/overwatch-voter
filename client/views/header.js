const html = require('choo/html')
var ga = require('ga-browserify')
var tracker = ga('UA-8301156-3')

module.exports = function () {
  return html`
    <div>
      <div class='promo gray i'>
        Pssst... if you'd like to learn how to build apps like this, check out my
        <a
          class='gray dim'
          onclick=${logClick}
          href='https://fullstackreact.com/?via=overwatchcountersguide' target='_blank'>
          book on React</a>.
      </div>

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
            class="f6 f5-l link white-80 dib pr3 dim ${on('/counters')}"
            href="/counters" >
            Counterpicks
          </a>
          <a
            class="f6 f5-l link white-80 dib pr3 dim ${on('/maps')}"
            href="/maps" >
            Maps
          </a>
        </nav>
      </div>

    </div>
  `
}

function on (path) {
  return window.location.pathname === path ? 'selected' : ''
}

function logClick (evt) {
  tracker._trackEvent('misc', 'click', 'reactbook', 1)
}
