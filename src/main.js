import 'pixi'
import 'p2'
import Phaser from 'phaser'

import GameState from './states/Game'
import GameMenu from './states/GameMenu'
import HighScore from './states/HighScore'
import * as firebase from 'firebase'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('GameMenu', GameMenu, false)
    this.state.add('Game', GameState, false)
    this.state.add('HighScore', HighScore, false)

    var fconf = {
      apiKey: 'AIzaSyDgO1RDaI_eGfUZ1eyI1Xm2NfvW8EBRIIw',
      authDomain: 'loremipsum-e6eac.firebaseapp.com',
      databaseURL: 'https://loremipsum-e6eac.firebaseio.com',
      projectId: 'loremipsum-e6eac',
      storageBucket: '',
      messagingSenderId: '973075222044'
    }
    firebase.initializeApp(fconf)

    this.state.start('GameMenu')
  }
}

window.game = new Game()
