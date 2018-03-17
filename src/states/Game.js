/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.keys = {}
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('enemy', './assets/images/monster.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('ground', './assets/images/ground.png')
    this.load.image('background', './assets/images/background.png')

    var background;
  }

  create () {
    game.stage.backgroundColor = '#3598db'
    background = game.add.tileSprite(0, 0, 760, 400, 'background')

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.world.enableBody = true

    //  Text
    this.stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

    // Create the player in the middle of the game
    this.player = game.add.sprite(100, 100, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.enemy = game.add.sprite(0, 100, 'enemy')
    this.enemy.scale.setTo(0.2, 0.25)

    this.block = game.add.group()

    var chars = [
      'fj fj fjfj fj'
    ]
    const width = 100

    for (let x = 0; x < chars.length; x++) {

    }

    let block = game.add.sprite(300, 100, 'block')
    block.height = 50
    block.width = 50
    block.value = 'G'
    var text = game.add.text(30, 20, block.value, {
      font: 'bold 60px Arial'
    })
    block.addChild(text)
    this.block.add(block)
    block.body.immovable = true

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

    background.tilePosition.x += 2

    let nextBlock = this.block.getFirstAlive()
    if (nextBlock) {
      let nextLetter = nextBlock.value
      if (this.keys[nextLetter].isDown) {
        this.player.body.velocity.x = 50
        this.removeLetter(nextBlock)
      }
    }

    game.physics.arcade.collide(this.player, this.block)
    this.enemy.body.velocity.x = 100
    // } else {
    //   this.player.body.velocity.x = 0
    // }
    //
    // // Make the player jump if he is touching the ground
    // if (this.cursor.up.isDown && this.player.body.touching.down) {
    //   this.player.body.velocity.y = -250
    // }

    // Make the player and the walls collide
    game.physics.arcade.collide(this.player, this.block)

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)

    // Call the 'restart' function when the enemy touches the player
    game.physics.arcade.overlap(this.enemy, this.player, this.killPlayer, null, this)
  }

  killPlayer () {
    this.player.kill()

    this.stateText.text = " GAME OVER \n Click to restart";
    this.stateText.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(this.restart, this);
  }

  removeLetter (letter) {
    letter.kill()
  }

  restart () {
    game.state.start('Game')
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
