const html = require('choo/html')

module.exports = function (term, cb) {
  var color = term ? 'light-gray' : 'gray'

  return html`
    <div>
      <input
        type='text'
        value=${term}
        placeholder='Search'
        onkeyup=${(e) => cb(e.target.value)}
        class='${color} bg-dark-gray ba pa2 mt3' />

      <span>
        ${!term ? '' : html`
          <a
            onclick=${(e) => cb('')}
            class='f5 dim white underline pa2'>
            Clear
          </a>
        `}
      </span>
    </div>
  `
}


// module.exports = function (state, prev, send) {
//   var term = state.searchTerm
//
//   return html`
//     <div>
//       <input
//         type='text'
//         value=${state.searchTerm}
//         placeholder='Search'
//         onkeyup=${search}
//         class='${term ? 'light-gray' : 'gray'} bg-dark-gray ba pa2 mt3' />
//
//       <span>
//         ${!term ? '' : html`
//           <a
//             onclick=${(e) => send('setSearchTerm', '')}
//             class='f5 dim white underline pa2'>
//             Clear
//           </a>
//         `}
//       </span>
//     </div>
//   `
//
//   function search (evt) { send('setSearchTerm', evt.target.value) }
// }
