/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }
  preload() {

    this.load.image('player', './assets/images/mushroom2.png')
    this.load.image('wall', './assets/images/mushroom2.png')
  }

  create() {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db';

    // Start the Arcade physics system (for movements and collisions)
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add the physics engine to all game objects
    game.world.enableBody = true;


    // Variable to store the arrow key pressed
    this.cursor = game.input.keyboard.createCursorKeys();

    // Create the player in the middle of the game
    this.player = game.add.sprite(70, 60, 'player');

    // Add gravity to make it fall
    this.player.body.gravity.y = 200;


    // Create 3 groups that will contain our objects
    this.walls = game.add.group();

    // Design the level. x = wall, o = coin, ! = lava.
    var level = [
        'xxx   xxxxxxx    x'
    ];

    // Create the level by going through the array
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[i].length; j++) {

          // Create a wall and add it to the 'walls' group
          if (level[i][j] == 'x') {
              var wall = game.add.sprite(30+20*j, 100+20*i, 'wall');
              this.walls.add(wall);
              wall.body.immovable = true;
          }
      }
    }
  }

  update(){
    // Move the player when an arrow key is pressed
    if (this.cursor.left.isDown)
      this.player.body.velocity.x = -200;
    else if (this.cursor.right.isDown)
      this.player.body.velocity.x = 200;
    else
      this.player.body.velocity.x = 0;

    // Make the player jump if he is touching the ground
    if (this.cursor.up.isDown && this.player.body.touching.down)
      this.player.body.velocity.y = -250;

    // Make the player and the walls collide
    game.physics.arcade.collide(this.player, this.walls);

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);

    // Call the 'restart' function when the player touches the enemy
    game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
  }

  // Function to kill a coin
  takeCoin(player, coin){
    coin.kill();
  }

  // Function to restart the game
  restart() {
    game.state.start('main');
  }

  render(){
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
