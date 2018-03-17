/* globals __DEV__ */
import Phaser from 'phaser'

/* global game */
export default class extends Phaser.State {
  init () {
    this.keys = {}

    // scale to fullscreen: is this the right place to do this? from: http://www.html5gamedevs.com/topic/21531-scale-to-any-screen-size-the-best-solution/
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('bullet', './assets/images/fireball.png')
    this.load.image('enemy', './assets/images/monster.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('background', './assets/images/background.png')
  }

  create () {
    game.stage.backgroundColor = '#3598db'
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')

    game.world.setBounds(0, 0, game.width * 5, game.width * 5)

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.world.enableBody = true

    //  Text
    this.stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' })
    this.stateText.anchor.setTo(0.5, 0.5)
    this.stateText.visible = false

    // Create the player in the middle of the game
    this.player = game.add.sprite(100, 100, 'player')
    this.player.scale.setTo(0.4, 0.5)
    game.camera.follow(this.player)

    this.weapon = game.add.weapon(-1, 'bullet')
    // Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    this.weapon.trackSprite(this.player, 14, 0);

    this.enemy = game.add.sprite(0, 100, 'enemy')
    this.enemy.scale.setTo(0.2, 0.25)

    this.blocks = game.add.group()

    const chars = 'fjfjffjfjfgh fjfjffjfjfgh fjfjffjfjfgh fjfjffjfjfgh fjfjffjfjfgh'
    let startPositionX = 300
    const blockSize = 50

    for (let i = 0; i < chars.length; i++) {
      startPositionX += blockSize + 10
      if (chars[i] === ' ') {
        continue
      }
      let block = game.add.sprite(startPositionX, 100, 'block')
      block.height = blockSize
      block.width = blockSize
      block.body.immovable = true
      block.value = chars.charAt(i).toUpperCase()
      let text = game.add.text(30, 20, chars.charAt(i), {
        font: 'bold 60px Arial'
      })
      block.addChild(text)
      this.blocks.add(block)
    }

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
    this.player.body.velocity.x = 100
    this.bg.tilePosition.x -= 1

    let nextBlock = this.blocks.getFirstAlive()
    if (nextBlock) {
      let nextLetter = nextBlock.value
      if (this.keys[nextLetter].isDown) {
        this.weapon.fire()
        this.removeLetter(nextBlock)
      }
    }

    game.physics.arcade.collide(this.player, this.block)
    this.enemy.body.velocity.x = 90

    // Make the player and the walls collide
    game.physics.arcade.collide(this.player, this.blocks)

    // Call the 'restart' function when the enemy touches the player
    game.physics.arcade.overlap(this.enemy, this.player, this.killPlayer, null, this)
  }

  killPlayer () {
    this.player.kill()

    this.stateText.text = ' GAME OVER \n Click to restart'
    this.stateText.visible = true

    game.input.onTap.addOnce(this.restart, this)
  }

  removeLetter (letter) {
    letter.kill()
  }

  restart () {
    game.state.start('Game')
  }

  render () {
    if (__DEV__) {
      game.debug.cameraInfo(game.camera, 32, 32)
      game.debug.spriteCoords(this.player, 32, 250)
    }
  }
}
