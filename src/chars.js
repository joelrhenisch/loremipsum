let text = ''
const possible = 'abcdefghijklmnopqrstufwxyz'
const length = 100

for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

export default text
