let text = ''
//const possible = 'abcdefghijklmnopqrstufwxyz0912345678.,'
const possible = 'abcdefghijklmnopqrstufwxyz.,'
const length = 200

for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

export default text
