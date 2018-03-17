import 'pixi'
import 'p2'
import Phaser from 'phaser'

import GameState from './states/Game'
import GameMenu from './states/GameMenu'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('GameMenu', GameMenu, false)
    this.state.add('Game', GameState, false)

    this.state.start('GameMenu')
  }
}

window.game = new Game()
