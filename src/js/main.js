import Phaser from 'phaser';
import Bootloader from './scenes/bootloader.js';
import Splash from './scenes/splash.js';
import Transition from './scenes/transition.js';
import Game from './scenes/game.js';
import Outro from './scenes/outro.js';

import '../style.css'

const gameConfig = {
    type: Phaser.AUTO,
    width: 360,
    height: 700,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 100, y: 200}
        }
    },
    scene: [Bootloader, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(gameConfig);
