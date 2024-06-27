import PreloadScene from './PreloadScene.js';
import GameScene from './GameScene.js';
import { Constant } from './Constant.js';

// Load our scenes
let preloadScene = new PreloadScene();
let gameScene = new GameScene();

window.onload = function () {
    Constant.isMobile = /iPhone|iPhoneX|iPod|iPad|BlackBerry|kindle|playbook|Windows Phone|Android/i.test(navigator.userAgent);
    let config;
    if (Constant.isMobile) {
        config = {
            type: Phaser.AUTO,
            backgroundColor: 0x222222,
            parent: 'template',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },

            width: window.innerWidth,
            height: window.innerHeight,
        };
    } else {
        config = {
            type: Phaser.AUTO,
            backgroundColor: 0x222222,
            parent: 'template',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },

            width: 1080,
            height: 1920,
        };
    }

    Constant.game = new Phaser.Game(config);
    Constant.scaleFactor = config.height / 1920;

    window.focus();

    // load scenes
    Constant.game.scene.add('PreloadScene', preloadScene);
    Constant.game.scene.add("GameScene", gameScene);

    // start title
    Constant.game.scene.start('PreloadScene');
}