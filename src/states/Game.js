/* globals __DEV__ */
import Phaser from 'phaser'

import chars from '../chars'
import * as firebase from 'firebase'

let startPositionX = 600
const blockSize = 50
var yOffset = -100

let it = {
  '1': 'ONE',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE',
  '0': 'ZERO',
  ',': 'COMMA',
  '.': 'PERIOD'
}

/* global game, __DEV__ */
export default class extends Phaser.State {
  init () {
    this.indexOfAimingBlock = 0
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
    //this.load.image('background', './assets/images/background.png')
    this.load.image('targetcross', './assets/images/targetcross.png')

    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);

    this.load.audio('sound', ['assets/audio/sound.mp3'])
    this.load.audio('shoot', ['assets/audio/blaster.mp3'])
    this.load.audio('explosion', ['assets/audio/explosion.mp3'])
  }

  create () {
    //game.stage.backgroundColor = '#3598db'
    game.world.enableBody = true
    const totalGameWidth = chars.length * (blockSize + 10) + startPositionX + 600
    game.world.setBounds(0, 0, totalGameWidth, game.height)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    const music = game.add.audio('sound')
    music.play()
    this.shootSound = game.add.audio('shoot')
    this.explosionSound = game.add.audio('explosion')

    //this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')
    //background canvas
    var myBackgroundGradient = game.add.bitmapData(game.width, game.height);
    var grd = myBackgroundGradient.context.createLinearGradient(0,0,0,game.height);
    grd.addColorStop(0, "#4459FF");
    grd.addColorStop(1, "#D244FF");
    myBackgroundGradient.context.fillStyle = grd;
    myBackgroundGradient.context.fillRect(0,0,game.width,game.height);
    this.bg = game.add.tileSprite(0, 0, game.width, game.height, myBackgroundGradient);
    this.bg.fixedToCamera = true

    //bottomline canvas ???
    var myBottomGradient = game.add.bitmapData(game.width, 100);
    var grdbtm = myBottomGradient.context.createLinearGradient(0,0,0,game.height);
    grdbtm.addColorStop(0, "#00A0FF");
    grdbtm.addColorStop(1, "#002CFF");
    myBottomGradient.context.fillStyle = grdbtm;
    myBottomGradient.context.fillRect(0,game.height-100,game.width,game.height);
    this.bottombg = game.add.tileSprite(0, game.height-100, game.width, game.height, myBottomGradient);
    this.bottombg.fixedToCamera = true

    this.drawMountain(0.5,Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 400) + 100),0)
    var mountainOffset = 0
    while(mountainOffset <= totalGameWidth) {
      let randWidth = Math.floor((Math.random() * 200) + 100)
      mountainOffset += randWidth

      this.drawCloud(0.3, Math.floor((Math.random() * 100) + 60), mountainOffset)
      this.drawMountain(0.5,randWidth,Math.floor((Math.random() * 400) + 100),mountainOffset)
    }

    this.stateText = game.add.text(50, 100, { font: 'bold 60px Arial', fill: 'white' })
    this.stateText.visible = false
    this.stateText.fixedToCamera = true

    this.displayScore = game.add.text(50, 80, ' ', { font: '20px Arial', fill: 'white' })
    this.displayScore.visible = false
    this.displayScore.fixedToCamera = true
    this.score = 0

    this.displayHighScore = game.add.text(50, 40, ' ', { font: '20px Arial', fill: 'white' })
    this.displayHighScore.text = 'Highscore: ' + this.highScore
    this.displayHighScore.visible = true
    this.displayHighScore.fixedToCamera = true

    this.player = game.add.sprite(200, game.world.centerY / 2 - yOffset, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.cameraplayer = game.add.sprite(this.player.position.x + 300, game.world.centerY / 2 - yOffset, 'cameraplayer')
    this.cameraplayer.alpha = 0

    this.enemy = game.add.sprite(0, game.world.centerY / 2 - yOffset, 'enemy')
    this.enemy.scale.setTo(0.5, 0.55)

    this.weapon = game.add.weapon(-1, 'bullet')
    this.weapon.fireAngle = Phaser.ANGLE_RIGHT
    // Tell the Weapon to track the 'player' Sprite
    this.weapon.trackSprite(this.player, 130, 20)
    this.weapon.bulletSpeed = 400

    game.camera.follow(this.cameraplayer, game.camera.lerpX = 0.4)
    this.blocks = game.add.group()
    var blockpositionX = startPositionX

    for (let i = 0; i < chars.length; i++) {
      blockpositionX += blockSize + 10
      if (chars[i] === ' ') {
        continue
      }
      let block = game.add.sprite(blockpositionX, game.world.centerY / 2 - yOffset, 'block')
      //let explosion = game.add.sprite(blockpositionX, game.world.centerY / 2 - yOffset, 'kaboom')
      block.height = blockSize
      block.width = blockSize
      block.body.immovable = true
      block.value = chars.charAt(i).toUpperCase()
      let text = game.add.text(30, 20, chars.charAt(i), {
        font: 'bold 60px Arial'
      })
      block.addChild(text)
      this.blocks.add(block)
      //this.explosions.add(explosion)
    }

    //  An explosion pool
    this.explosions = game.add.group()
    this.explosions.createMultiple(this.blocks.length, 'kaboom')
    this.explosions.forEach(this.setupExplosions, this)

    this.targetcross = game.add.sprite(startPositionX + blockSize + 10, game.world.centerY / 2 - yOffset, 'targetcross')
    this.targetcross.scale.setTo(0.5, 0.5)

    this.registerKeys()
  }

  setupExplosions(explosion) {
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');
}

  registerKeys () {
    for (let key in Phaser.KeyCode) {
      if (Phaser.KeyCode.hasOwnProperty(key) && key.match(/[a-z0-9]/i)) {
        let realKey = it[key] || key
        this.keys[realKey] = this.input.keyboard.addKey(Phaser.KeyCode[key])
      }
    }
  }

  update () {
    if (this.ended) { return }
    this.enemyVelocity = this.enemyVelocity + 0.08
    this.playerVelocity = this.playerVelocity + 0.08
    this.player.body.velocity.x = this.playerVelocity
    this.cameraplayer.position.x = this.player.position.x + 300
    this.enemy.body.velocity.x = this.enemyVelocity
    this.bg.tilePosition.x -= 1

    let nextBlock = this.blocks.getAt(this.indexOfAimingBlock)
    if (nextBlock) {
      let nextLetter = nextBlock.value
      nextLetter = it[nextLetter] || nextLetter
      if (this.keys[nextLetter].isDown && nextLetter != this.previousLetter) {
        this.previousLetter = nextLetter
        if (this.indexOfAimingBlock + 1 < this.blocks.length) {
          this.indexOfAimingBlock = this.indexOfAimingBlock + 1
        }
          let aimingBlock = this.blocks.getAt(this.indexOfAimingBlock)
          this.targetcross.position = aimingBlock.position
          this.shoot()
        
      } else if (this.previousLetter != '' && this.keys[this.previousLetter].isDown == false) {
        this.previousLetter = ''
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

  shoot () {
    this.weapon.fire()
    this.shootSound.play()
  }

  win () {
    this.ended = true
    this.showText('!!YEAH!!')
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
    this.ended = true
    this.player.kill()
    this.blocks.kill()
    this.showText('!!GAME OVER!!\nclick to restart')
    this.setHighScore()
    this.enemyVelocity = 0
    this.enemy.scale.setTo(1, 1)
    game.input.onTap.addOnce(this.restart, this)
  }

  removeBlock (bullet, block) {
    block.kill()
    bullet.kill()

    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(block.body.x, block.body.y);
    explosion.play('kaboom', 30, false, true);

    this.explosionSound.play()
    this.refreshScore()
  }

  refreshScore () {
    this.score += 1
    this.displayScore.text = 'Score: ' + this.score
    this.displayScore.visible = true
  }

  setHighScore () {
    let highScore
    if (this.score > this.highScore) {
      localStorage.setItem('highScore', this.score)
      highScore = this.score
    }

    let uname = localStorage.getItem('username')
    firebase.database().ref('scores/' + uname).set({
      uname: uname,
      score: this.score,
      highScore: highScore || null
    })
  }

  restart () {
    this.ended = false
    game.state.start('Game')
  }

  drawMountain(alpha, triangleX, triangleY, offset) {
    var graphics = game.add.graphics(triangleX/2+offset, game.height-triangleY);
    graphics.beginFill(0xFFFFFF);
    graphics.alpha = alpha
    graphics.lineTo(triangleX, triangleY);
    graphics.lineTo(-triangleX, triangleY);
    graphics.endFill();
  }

  drawCloud(alpha, width, offset){
    var graphics = game.add.graphics(0+offset, 0);
    graphics.beginFill(0xFFFFFF);
    graphics.alpha = alpha
    //graphics.drawCircle(0, 0, radius);
    //graphics.drawCircle(Math.floor((Math.random() * 100) + 60), 0, radius);
    graphics.drawEllipse(0, 0, width, width/2.5);
    graphics.drawEllipse((Math.random() * 100) + 60, 0, width, width/3);
    graphics.endFill();
  }


  render () {
    if (__DEV__) {
      // game.debug.cameraInfo(game.camera, 32, 32)
      // game.debug.spriteCoords(this.player, 32, 250)
    }
  }
}
