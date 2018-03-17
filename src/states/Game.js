/* globals __DEV__ */
import Phaser from 'phaser'

import chars from '../chars'

let startPositionX = 600
const blockSize = 50
var yOffset = -100

/* global game, __DEV__ */
export default class extends Phaser.State {
  init() {
    this.indexOfAimingBlock = 0;
    this.keys = {}
    this.previousLetter = ''
    this.enemyVelocity = 90
    this.playerVelocity = 100

    // scale to fullscreen: is this the right place to do this? from: http://www.html5gamedevs.com/topic/21531-scale-to-any-screen-size-the-best-solution/
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()

    if (localStorage.hasOwnProperty('highScore')) {
      this.highScore = localStorage.getItem('highScore')
    } else {
      localStorage.setItem('highScore', '0')
      this.highScore = 0
    }
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('bullet', './assets/images/fireball.png')
    this.load.image('enemy', './assets/images/monster.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('background', './assets/images/background.png')
    this.load.image('targetcross', './assets/images/targetcross.png')

    this.load.audio('sound', ['assets/audio/sound.mp3'])
  }

  create () {
    game.stage.backgroundColor = '#3598db'
    game.world.enableBody = true
    const totalGameWidth = chars.length * blockSize + startPositionX + 600
    game.world.setBounds(0, 0, totalGameWidth, game.height)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    const music = game.add.audio('sound')
    music.play()

    this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')
    this.bg.fixedToCamera = true

    this.stateText = game.add.text(50, 80, { font: 'bold 60px Arial', fill: 'white' })
    this.stateText.visible = false
    this.stateText.fixedToCamera = true

    this.displayScore = game.add.text(50, 50, ' ', { font: '20px Arial', fill: 'white' })
    this.displayScore.visible = false
    this.displayScore.fixedToCamera = true
    this.score = 0

    this.displayHighScore = game.add.text(50, 20, ' ', { font: '20px Arial', fill: 'white' })
    this.displayHighScore.text = 'Highscore: ' + this.highScore
    this.displayHighScore.visible = true
    this.displayHighScore.fixedToCamera = true

    this.player = game.add.sprite(200, game.world.centerY / 2 -yOffset, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.cameraplayer=game.add.sprite(this.player.position.x + 300, game.world.centerY / 2 -yOffset, 'cameraplayer')
    this.cameraplayer.alpha = 0

    this.enemy = game.add.sprite(100, game.world.centerY / 2 -yOffset, 'enemy')
    this.enemy.scale.setTo(0.2, 0.25)

    this.weapon = game.add.weapon(-1, 'bullet')
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT
    // Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    this.weapon.trackSprite(this.player, 130, 20)
    this.weapon.bulletSpeed = 400;

    game.camera.follow(this.cameraplayer, game.camera.lerpX = 0.4)
    this.blocks = game.add.group()

    var blockpositionX = startPositionX

    for (let i = 0; i < chars.length; i++) {
      blockpositionX += blockSize + 10
      if (chars[i] === ' ') {
        continue
      }
      let block = game.add.sprite(blockpositionX, game.world.centerY / 2 -yOffset, 'block')
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

    this.targetcross = game.add.sprite(startPositionX + blockSize + 10, game.world.centerY / 2 -yOffset, 'targetcross')
    this.targetcross.scale.setTo(0.5, 0.5)

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
    this.player.body.velocity.x = this.playerVelocity
    this.cameraplayer.position.x = this.player.position.x +300
    this.enemy.body.velocity.x = this.enemyVelocity
    this.bg.tilePosition.x -= 1

    let nextBlock = this.blocks.getAt(this.indexOfAimingBlock)
    if (nextBlock) {
      let nextLetter = nextBlock.value
      if (this.keys[nextLetter].isDown && nextLetter != this.previousLetter) {
        this.previousLetter = nextLetter
        if (this.indexOfAimingBlock + 1 < this.blocks.length) {
          this.indexOfAimingBlock = this.indexOfAimingBlock + 1
          let aimingBlock = this.blocks.getAt(this.indexOfAimingBlock)
          this.targetcross.position = aimingBlock.position
        }
        this.weapon.fire()
      }
      else if (this.previousLetter != '' && this.keys[this.previousLetter].isDown == false) {
        this.previousLetter = ''
      }
    }
    console.log(this.blocks)
    if (this.blocks.countLiving() === 0) {
      this.win()
    }

    game.physics.arcade.collide(this.player, this.block)
    game.physics.arcade.collide(this.player, this.blocks)
    game.physics.arcade.overlap(this.weapon.bullets, this.blocks, this.removeBlock, null, this)
    game.physics.arcade.overlap(this.enemy, this.player, this.killPlayer, null, this)
  }

  win () {
    this.showText("YEAH!")
    this.enemy.kill()
    this.setHighScore()
    this.targetcross.kill()
  }

  showText (text) {
    this.stateText.text = text
    this.stateText.visible = true
    this.stateText.bringToTop()
  }

  killPlayer () {
    this.player.kill()
    this.showText('GAME OVER \nClick to restart')
    this.setHighScore()
    this.enemyVelocity = 0
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
    this.displayScore.text = 'Score: ' + this.score
    this.displayScore.visible = true
  }

  setHighScore () {
    if (this.score > this.highScore) {
      localStorage.setItem('highScore', this.score)
    }
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
