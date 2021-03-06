import 'phaser';
import 'lodash';
import 'webfontloader';

import gameConfig from './config/game';

require('./index.html'); // so we get it in the dist

// import scenes
import LoadingScene from './scenes/loading';
import MainMenuScene from './scenes/main-menu';
import TutorialScene from './scenes/stage/tutorial';
import TutorialUIScene from './scenes/stage/tutorial-ui';
import CauldronUIScene from './scenes/cauldron-ui';

var phaserGameConfig = {
    type: Phaser.WEBGL,
    width: gameConfig.screen.width,
    height: gameConfig.screen.height,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true, // enable to see physics bodies outlined
        }
    },
    scene: [LoadingScene, MainMenuScene, TutorialScene, TutorialUIScene, CauldronUIScene]
}

let game = new Phaser.Game(phaserGameConfig);
