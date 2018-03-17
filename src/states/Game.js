/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
  }

  preload () {
    this.load.image('player', './assets/images/raumschiff.png')
    this.load.image('enemy', './assets/images/raumschiff.png')
    this.load.image('block', './assets/images/klotz.png')
    this.load.image('ground', './assets/images/ground.png')
  }

  create () {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db'

    // Start the Arcade physics system (for movements and collisions)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Add the physics engine to all game objects
    game.world.enableBody = true

    // Create the player in the middle of the game
    this.player = game.add.sprite(100, 100, 'player')
    this.player.scale.setTo(0.4, 0.5)

    this.enemy = game.add.sprite(0, 100, 'enemy')
    this.enemy.scale.setTo(0.2, 0.25)

    this.ground = game.add.group()
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
    this.ground.add(block)
    block.body.immovable = true
  }

  update () {
    // Move the player when an arrow key is pressed
    // if (this.cursor.left.isDown) {
    //   this.player.body.velocity.x = -200
    // } else if (this.cursor.right.isDown) {
    this.player.body.velocity.x = 200
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
    game.physics.arcade.collide(this.player, this.ground)

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)

    // Call the 'restart' function when the enemy touches the player
    game.physics.arcade.overlap(this.enemy, this.player, this.killPlayer, null, this)
  }

  killPlayer() {
    this.player.kill()
  }

  // Function to kill a coin
  takeCoin (player, coin) {
    coin.kill()
  }

  // Function to restart the game
  restart () {
    game.state.start('main')
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
