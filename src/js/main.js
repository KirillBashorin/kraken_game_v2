import Phaser from 'phaser';
import Bootloader from './scenes/bootloader.js';
import Splash from './scenes/splash.js';
import Transition from './scenes/transition.js';
import Game from './scenes/game.js';
import Outro from './scenes/outro.js';

import '../style.css';

const gameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        width: window.innerWidth,
        height: window.innerHeight,
        max: {
            width: 768,
            height: '100%',
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 100, y: 200 }
        }
    },
    scene: [Bootloader, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
