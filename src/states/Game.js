/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.keys = {}
    this.blocks = []
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('ground', './assets/images/ground.png')
  }

  create () {
    game.stage.backgroundColor = '#3598db'

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.world.enableBody = true

    // Create the player in the middle of the game
    this.player = game.add.sprite(10, 100, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.block = game.add.group()

    var chars = [
      'fj fj fjfj fj'
    ]
    const width = 100

    for (let x = 0; x < chars.length; x++) {

    }

    let block = game.add.sprite(300, 100, 'block')
    block.height = 100
    block.width = 100
    this.block.add(block)
    block.body.immovable = true
    this.blocks.push(block)

    this.registerKeys()
  }

  registerKeys () {
    for (let key in Phaser.KeyCode) {
      if (Phaser.KeyCode.hasOwnProperty(key) && key.match(/[a-z]/i)) {
        this.keys[key] = this.input.keyboard.addKey(Phaser.KeyCode[key])
      }
    }
  }

  update () {
    this.player.body.velocity.x = 200

    if (this.keys.A.isDown) {
      this.player.body.velocity.x = 50
      this.removeLetter(this.blocks[0])
    }

    game.physics.arcade.collide(this.player, this.block)
  }

  removeLetter (letter) {
    letter.kill()
  }

  restart () {
    game.state.start('main')
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
