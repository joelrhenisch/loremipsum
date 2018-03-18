/* globals __DEV__, game */
import Phaser from 'phaser'
import PhaserInput from 'phaser-input'

export default class extends Phaser.State {
  init () {
    this.optionCount = 1
    game.add.plugin(PhaserInput.Plugin)
  }

  preload () {
    this.load.image('background', './assets/images/background.png')
  }

  create () {
    game.stage.disableVisibilityChange = true
    game.add.tileSprite(0, 0, game.width, game.height, 'background')

    this.addMenuOption('[Start]', function () {
      if (this.input.value.trim() !== '') {
        localStorage.setItem('username', this.input.value.trim())
        game.state.start('Game')
      }
    })

    this.addMenuOption('[Highscore]', function () {
      game.state.start('HighScore')
    })

    const titleText = game.add.text(game.world.centerX, 100, 'Lorem Ipsum', {
      font: 'bold 50px Arial',
      fill: '#FFFFFF',
      align: 'center'
    })
    titleText.anchor.set(0.5)

    this.input = game.add.inputField(game.world.centerX - 140 / 2, 140, {
      font: '20px Arial',
      fontWeight: 'bold',
      fill: '#fff',
      fillAlpha: 0.3,
      width: 140,
      height: 25,
      padding: 8,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 3,
      placeHolder: 'username',
      type: PhaserInput.InputType.text
    })

    let stored = localStorage.getItem('username') !== 'null' ? localStorage.getItem('username') : ''
    if (stored) {
      this.input.setText(stored)
    }
  }

  addMenuOption (text, callback) {
    const txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 140, text, {
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
