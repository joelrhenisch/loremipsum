/* globals __DEV__, game */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    // scale to fullscreen: is this the right place to do this? from: http://www.html5gamedevs.com/topic/21531-scale-to-any-screen-size-the-best-solution/
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()

    this.keys = {}

    this.titleText = game.make.text(game.world.centerX, 100, 'Lorem Ipsum', {
      font: 'bold 50pt Arial',
      fill: '#FFFFFF',
      align: 'center'
    })
    this.titleText.anchor.set(0.5)
    this.optionCount = 1
  }

  preload () {
    this.load.image('background', './assets/images/background.png')
  }

  create () {
    game.stage.disableVisibilityChange = true
    game.add.sprite(0, 0, 'background')
    game.add.existing(this.titleText)

    this.addMenuOption('[Start]', function () {
      game.state.start('Game')
    })

    this.addMenuOption('[Highscore]', function () {
      game.state.start('Game')
    })
  }

  addMenuOption (text, callback) {
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 100, text, {
      fill: '#FFFFFF',
      align: 'center'
    })
    txt.anchor.setTo(0.5)
    txt.stroke = 'rgba(0,0,0,0)'
    txt.strokeThickness = 4

    var onOver = function (target) {
      target.fill = '#FEFFD5'
      target.stroke = 'rgba(200,200,200,0.5)'
      txt.useHandCursor = true
    }
    var onOut = function (target) {
      target.fill = 'white'
      target.stroke = 'rgba(0,0,0,0)'
      txt.useHandCursor = false
    }

    // txt.useHandCursor = true;
    txt.inputEnabled = true
    txt.events.onInputUp.add(callback, this)
    txt.events.onInputOver.add(onOver, this)
    txt.events.onInputOut.add(onOut, this)

    this.optionCount++
  }
}
