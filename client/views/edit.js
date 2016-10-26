const html = require('choo/html')

module.exports = function (agent, object, modifier, cb) {
  const gradeButtons = [
    {letter: 'A', color: 'green'},
    {letter: 'B', color: 'dark-green'},
    {letter: 'C', color: 'gray'},
    {letter: 'D', color: 'dark-red'},
    {letter: 'F', color: 'red'}
  ]

  return html`
    <div class='tc modal bg-dark-gray pa5'>
      <div class='f1 center'>
        How would you rate <strong>${agent}'s</strong> ability ${modifier} <strong>${object}</strong>?
      </div>

      <section class="pa3 pa4-m pa5-l center">
        ${gradeButtons.map((gb, i) => html`
          <a
            onclick=${(e) => rate(5 - i)}
            class='hover-${gb.color} f1 link grow b no-underline dib ph2 pv1'>
            ${gb.letter}
          </a>
        `)}
      </section>

      <section class="pa3 pa4-m pa5-l center">
        <a
          onclick=${(e) => cb()}
          class="f3 gray dim">
          Cancel
        </a>
      </section>
    </div>
  `

  function rate (rating) {
    cb({
      agent: agent,
      object: object,
      rating: rating
    })
  }
}
