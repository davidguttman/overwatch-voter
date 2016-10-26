const html = require('choo/html')

module.exports = function (combo, modifier) {
  if (!combo || !combo.agent) return ''

  return html`
    <div class='pt3 light-gray'>
      <p class='f5'>
        <strong>${combo.agent}</strong>
        <span class='light-silver'>${modifier}</span>
        <br />
        ${combo.target}
      </p>

      ${renderDistTable(combo)}

      <p class='f6'>${combo.count} ratings</p>
    </div>
  `
}

function renderDistTable (combo) {
  return html`
    <table style='width: 100%'>
      ${[5, 4, 3, 2, 1].map(function (score) {
        var scoreVotes = combo.dist[score]
        var grade = scoreToGrade(score)
        var pct = 100 * scoreVotes / combo.count
        var isLocalScore = score === combo.localRating
        var color = isLocalScore ? 'white' : 'light-silver'

        return html`
          <tr>
            <td class='pr1 ${color}'>
              ${grade}
            </td>
            <td style='width: 100%'>
              <div
                class='bg-${color}'
                style='height: 10px; width: ${pct}%'>
              </div>
            </td>
          </tr>
        `
      })}

    </table>
  `
}

function scoreToGrade (score) {
  return { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F' }[score]
}
