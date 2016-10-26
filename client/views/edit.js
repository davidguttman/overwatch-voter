const html = require('choo/html')

module.exports = function (state, prev, send) {
  var asHero = state.editTarget.asHero
  var map = state.editTarget.map
  var letterStyle = "f1 link grow b no-underline dib ph2 pv1"

  function rate (rating) {
    send('rateMapCombo', {
      asHero: asHero,
      map: map,
      rating: rating
    })
  }

  return html`
    <div class='tc modal bg-dark-gray pa5'>
      <div class='f1 center'>
        How would you rate <strong>${asHero}'s</strong> ability on <strong>${map}</strong>?
      </div>

      <section class="pa3 pa4-m pa5-l center">
        <a
          onclick=${(e) => rate(5)}
          class=${'hover-green ' + letterStyle} >
          A
        </a>
        <a
          onclick=${(e) => rate(4)}
          class=${'hover-dark-green ' + letterStyle} >
          B
        </a>
        <a
          onclick=${(e) => rate(3)}
          class=${'hover-gray ' + letterStyle} >
          C
        </a>
        <a
          onclick=${(e) => rate(2)}
          class=${'hover-dark-red ' + letterStyle} >
          D
        </a>
        <a
          onclick=${(e) => rate(1)}
          class=${'hover-red ' + letterStyle} >
          F
        </a>
      </section>

      <section class="pa3 pa4-m pa5-l center">
        <a
          onclick=${(e) => send('cancelEditCombo')}
          class="f3 gray dim">
          Cancel
        </a>
      </section>
    </div>
  `
}
