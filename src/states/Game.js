/* globals __DEV__ */
import Phaser from 'phaser'

import chars from '../chars'

let startPositionX = 300
const blockSize = 50

/* global game, __DEV__ */
export default class extends Phaser.State {
  init () {
    this.keys = {}

    // scale to fullscreen: is this the right place to do this? from: http://www.html5gamedevs.com/topic/21531-scale-to-any-screen-size-the-best-solution/
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()

    if (localStorage.hasOwnProperty('highScore')) {
      this.highScore = localStorage.getItem('highScore')
    } else {
      this.highScore = 0
    }
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('bullet', './assets/images/fireball.png')
    this.load.image('enemy', './assets/images/monster.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('background', './assets/images/background.png')

    this.load.audio('sound', ['assets/audio/sound.mp3'])
  }

  create () {
    game.stage.backgroundColor = '#3598db'
    game.world.enableBody = true
    const totalGameWidth = chars.length * blockSize + startPositionX + 200
    game.world.setBounds(0, 0, totalGameWidth, game.height)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    const music = game.add.audio('sound')
    music.play()

    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')
    this.bg.fixedToCamera = true

    this.stateText = game.add.text(100, 100, ' ', { font: '60px Arial', fill: 'red' })
    this.stateText.visible = false
    this.stateText.fixedToCamera = true

    this.displayScore = game.add.text(game.width / 4, 200, ' ', { font: '20px Arial', fill: 'white' })
    this.displayScore.visible = false
    this.displayScore.fixedToCamera = true
    this.score = 0

    this.displayHighScore = game.add.text(game.width / 4, 170, ' ', { font: '20px Arial', fill: 'white' })
    this.displayHighScore.text = 'Highscore: ' + this.highScore
    this.displayHighScore.visible = true
    this.displayHighScore.fixedToCamera = true

    this.player = game.add.sprite(100, game.world.centerY / 2, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.enemy = game.add.sprite(0, game.world.centerY / 2, 'enemy')
    this.enemy.scale.setTo(0.2, 0.25)

    this.weapon = game.add.weapon(-1, 'bullet')
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT
    // Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    this.weapon.trackSprite(this.player, 130, 20)

    game.camera.follow(this.player)
    this.blocks = game.add.group()

    for (let i = 0; i < chars.length; i++) {
      startPositionX += blockSize + 10
      if (chars[i] === ' ') {
        continue
      }
      let block = game.add.sprite(startPositionX, game.world.centerY / 2, 'block')
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
    this.enemy.body.velocity.x = 90
    this.bg.tilePosition.x -= 1

    let nextBlock = this.blocks.getFirstAlive()
    if (nextBlock) {
      let nextLetter = nextBlock.value
      if (this.keys[nextLetter].isDown) {
        this.weapon.fire()
      }
    }

    if (this.blocks.countLiving() === 0) {
      this.win()
    }

    game.physics.arcade.collide(this.player, this.block)
    game.physics.arcade.collide(this.player, this.blocks)
    game.physics.arcade.overlap(this.weapon.bullets, this.blocks, this.removeBlock, null, this)
    game.physics.arcade.overlap(this.enemy, this.player, this.killPlayer, null, this)
  }

  win () {
    this.showText('!YEAH!')
    this.enemy.kill()
  }

  showText (text) {
    this.stateText.text = text
    this.stateText.visible = true
    this.stateText.bringToTop()
  }

  killPlayer () {
    this.player.kill()

    this.showText('GAME OVER \n Click to restart')

    if (this.score > this.highScore) {
      localStorage.setItem('highScore', this.score)
    }

    game.input.onTap.addOnce(this.restart, this)
  }

  removeBlock (bullet, block) {
    block.kill()
    bullet.kill()
    this.refreshScore()
  }

  refreshScore () {
    console.log('refreshscore')
    this.score += 1
    this.displayScore.text = ' Score: ' + this.score
    this.displayScore.visible = true
  }

  restart () {
    game.state.start('Game')
  }

  render () {
    if (__DEV__) {
      // game.debug.cameraInfo(game.camera, 32, 32)
      // game.debug.spriteCoords(this.player, 32, 250)
    }
  }
}
