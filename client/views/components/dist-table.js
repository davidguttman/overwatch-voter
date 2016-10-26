const html = require('choo/html')

module.exports = function renderDistTable (highlight) {
  return html`
    <table style='width: 100%'>
      ${ [5, 4, 3, 2, 1].map(function (score) {
        var scoreVotes = highlight.dist[score]
        var grade = scoreToGrade(score)
        var pct = 100 * scoreVotes / highlight.count
        var isLocalScore = score === highlight.localRating
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

      }) }

    </table>
  `
}

function scoreToGrade (score) {
  return { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F' }[score]
}
