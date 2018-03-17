var GameMenu = function() {};


GameMenu.prototype = {
/*
  menuConfig: {
    startY: 260,
    startX: 30
  },
  */

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Lorem Ipsum", {
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.anchor.set(0.5)
    this.optionCount = 1
    this.load.image('background', './assets/images/background.png')

  }

  create: function () {
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.titleText);

    // looks like we have to create a style for or menu option
    var optionStyle = { fill: 'white', align: 'left' };
    // the text for start
    var txt = game.add.text(30, 280, 'Start', optionStyle);
    // so how do we make it clickable?  We have to use .inputEnabled!
    txt.inputEnabled = true;
    // Now every time we click on it, it says "You did it!" in the console!
    txt.events.onInputUp.add(function () { console.log('You did it!') });

    this.addMenuOption('Start', function () {
      game.state.start("Game");
    });
    /*
    this.addMenuOption('Options', function () {
      game.state.start("Options");
    });
    this.addMenuOption('Credits', function () {
      game.state.start("Credits");
    });
    */
  }

  addMenuOption: function(text, callback) {
     var optionStyle = { fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
     var txt = game.add.text(30, (this.optionCount * 80) + 200, text, optionStyle);
     var onOver = function (target) {
       target.fill = "#FEFFD5";
       target.stroke = "rgba(200,200,200,0.5)";
     };
     var onOut = function (target) {
       target.fill = "white";
       target.stroke = "rgba(0,0,0,0)";
     };
     txt.stroke = "rgba(0,0,0,0";
     txt.strokeThickness = 4;
     txt.inputEnabled = true;
     txt.events.onInputUp.add(callback);
     txt.events.onInputOver.add(onOver);
     txt.events.onInputOut.add(onOut);
     this.optionCount ++;
   },

};

// Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
