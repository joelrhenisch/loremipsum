/* globals __DEV__, game */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.optionCount = 1
  }

  preload () {
    this.load.image('background', './assets/images/background.png')
  }

  create () {
    game.stage.disableVisibilityChange = true
    game.add.tileSprite(0, 0, game.width, game.height, 'background')

    this.addMenuOption('[Start]', function () {
      game.state.start('Game')
    })

    const titleText = game.add.text(game.world.centerX, 100, 'Lorem Ipsum', {
      font: 'bold 50px Arial',
      fill: '#FFFFFF',
      align: 'center'
    })
    titleText.anchor.set(0.5)

    let stored = localStorage.getItem('username') !== 'null' ? localStorage.getItem('username') : ''
    let uname = window.prompt('username', stored)
    localStorage.setItem('username', uname)
  }

  addMenuOption (text, callback) {
    const txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 100, text, {
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
