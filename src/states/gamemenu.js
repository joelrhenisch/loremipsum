/* globals __DEV__ */
import Phaser from 'phaser'
/* global game */
var titleText;
var startText;
var optionCount;

export default class extends Phaser.State {
  init () {
    this.keys = {}
    this.titleText = game.make.text(game.world.centerX, 100, "Lorem Ipsum", {
      fill: '#FDFFB5',
      align: 'center'
    })
    this.titleText.anchor.set(0.5)
    this.startText = game.make.text(game.world.centerX, 150, "Start", {
      fill: '#FDFFB5',
      align: 'center'
    })
    this.startText.anchor.set(0.5)
    this.optionCount = 1;
  }

  preload () {
    this.load.image('background', './assets/images/background.png')
  }

  create() {
    game.stage.disableVisibilityChange = true
    game.add.sprite(0, 0, 'background')
    game.add.existing(this.titleText)

    this.addMenuOption('Start', function () {
          game.state.start("Game");
    });

  }

  addMenuOption(text, callback) {
   var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text);
   txt.anchor.setTo(0.5);
   txt.stroke = "rgba(0,0,0,0";
   txt.strokeThickness = 4;

   var onOver = function (target) {
     target.fill = "#FEFFD5";
     target.stroke = "rgba(200,200,200,0.5)";
     txt.useHandCursor = true;
   };
   var onOut = function (target) {
     target.fill = "white";
     target.stroke = "rgba(0,0,0,0)";
     txt.useHandCursor = false;
   };

   //txt.useHandCursor = true;
   txt.inputEnabled = true;
   txt.events.onInputUp.add(callback, this);
   txt.events.onInputOver.add(onOver, this);
   txt.events.onInputOut.add(onOut, this);

   this.optionCount ++;
 }

}
