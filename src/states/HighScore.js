
/* globals __DEV__, game */
import Phaser from 'phaser'
import * as firebase from 'firebase'

export default class extends Phaser.State {
  init () {
    this.optionCount = 1
    this.list = 1
  }

  preload () {
    this.load.image('background', './assets/images/background.png')
  }

  create () {
    game.stage.disableVisibilityChange = true
    game.add.tileSprite(0, 0, game.width, game.height, 'background')

    const highscoreText = game.add.text(game.world.centerX, 50, 'HighScore', {
      font: 'bold 50px Arial',
      fill: '#FFFFFF',
      align: 'center'
    })
    highscoreText.anchor.set(0.5)

    this.addMenuOption('[Back to Menu]', function () {
      game.state.start('GameMenu')
    })
    this.scoreData = []
    const scores = firebase.database().ref('scores').orderByChild('score').limitToLast(10)
    scores.on('child_added', (snapshot) => {
      this.scoreData.push([snapshot.key, snapshot.val().score])
    })
    scores.on('value', (snapshot) => {
      this.scoreData.reverse().forEach(d => this.addHighScore(d[0] + ' : ' + d[1]))
    })
  }

  addHighScore (text) {
    var txt = game.add.text(game.world.centerX, ((this.optionCount + this.list) * 40) + 40, text, {
      fill: '#FFFFFF',
      align: 'center'
    })
    txt.anchor.setTo(0.5)
    this.list++
  }

  addMenuOption (text, callback) {
    const txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 30, text, {
      fill: '#FFFFFF',
      align: 'center'
    })
    txt.anchor.setTo(0.5)

    const onOver = function (target) {
      target.fill = '#FFFFFF'
      target.stroke = '#008dff'
      target.strokeThickness = 3
      txt.useHandCursor = true
    }
    const onOut = function (target) {
      target.fill = '#FFFFFF'
      target.stroke = 'rgba(0,0,0,0)'
      txt.useHandCursor = false
    }

    txt.inputEnabled = true
    txt.events.onInputUp.add(callback, this)
    txt.events.onInputOver.add(onOver, this)
    txt.events.onInputOut.add(onOut, this)

    this.optionCount++
  }
}
