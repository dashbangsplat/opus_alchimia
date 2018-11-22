import gameConfig from '../config/game';

import Player from '../actors/actor/player';
import Cauldron from '../props/prop/cauldron';

import AirEssence from '../props/prop/essence/air';
import DarkEssence from '../props/prop/essence/dark';
import EarthEssence from '../props/prop/essence/earth';
import FireEssence from '../props/prop/essence/fire';
import LightEssence from '../props/prop/essence/light';
import MagicEssence from '../props/prop/essence/magic';
import WaterEssence from '../props/prop/essence/water';

export default class WorldMapScene extends Phaser.Scene {
    constructor (config, key = 'WorldMap') {
        super({ key: key });
    }

    preload () {
        // load all the resources required for this scene before using them
    }

    init () {
        this.inputKeys = this.input.keyboard.createCursorKeys();

        this.inputKeys.altLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.inputKeys.altUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.inputKeys.altRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.inputKeys.altDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.inputKeys.jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.inputKeys.use = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    create () {
        this.actors = this.add.group();
        this.props = this.add.group();

        this.setupMap();

        this.setupProps();

        this.setupActors();

        let essenceX = this.player.x;
        [AirEssence, DarkEssence, EarthEssence, FireEssence, LightEssence, MagicEssence, WaterEssence].forEach( Essence => {
            essenceX += 100;
            let essence = new Essence(this, essenceX, this.player.y);
            console.log(essence);
            this.addOverlapping(essence);
            essence.addCollectionTarget(this.player);

        });

        this.actors.getChildren().forEach(child => this.addColliders(child));
        this.props.getChildren().forEach(child => this.addOverlapping(child));

        //console.log(this);
    }

    update () {
    }

    setupMap () {
        this.tilemap = this.make.tilemap({ key: gameConfig.worldMap.key });

        // sky
        let { widthInPixels: width, heightInPixels: height } = this.tilemap;
        this.sky = this.add.rectangle(width / 2, height / 2, width, height, 0xddddff);
        this.sky.setDepth(-10);

        this.tilesets = {};
        gameConfig.worldMap.tilesets.forEach(tileset => {
            this.tilesets[tileset.key] = this.tilemap.addTilesetImage(tileset.key);
        });

        this.tileLayers = {};
        gameConfig.worldMap.tileLayers.forEach(layer => {
            this.tileLayers[layer.name] = this.tilemap.createDynamicLayer(layer.name, this.tilesets[layer.tileset], 0, 0);

            // set z-index of layers per their depth setting, 0 is at the same depth as sprites
            this.tileLayers[layer.name].setDepth(layer.depth);
        });

        // set collision on middle layer 
        this.tileLayers.middle.setCollisionByProperty({ collides: true });

        this.tileLayers.foreground.setDepth(1);

        // resize world to match the tilemap
        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(0, 0, width, height);
    }

    setupActors () {
        let player = new Player(this);
        player.setX(player.width / 2);
        player.setY(this.tilemap.heightInPixels - 250);

        this.cameras.main.startFollow(player, true);

        this.player = player;
        this.actors.add(player);
    }

    setupProps () {
        let cauldron = new Cauldron(this);
        cauldron.setX(100);
        cauldron.setY(this.tilemap.heightInPixels - 160);

        this.props.add(cauldron);
    }

    // provides an interface for actors and props to setup colliders
    addColliders (thing) {
        let callback = thing.triggerCollisionHandlers ? (object1, object2) => { thing.triggerCollisionHandlers(object1, object2); } : () => {};

        if (!thing._tileCollider) thing._tileCollider = this.physics.add.collider(thing, this.tileLayers.middle, callback); // thing to collide with map
        if (!thing._actorsCollider) thing._actorsCollider = this.physics.add.collider(thing, this.actors, callback);
        if (!thing._propsCollider) thing._propsCollider = this.physics.add.overlap(thing, this.props, callback);
    }

    // provides an interface for props to setup overlapping
    addOverlapping (thing) {
        let callback = thing.triggerCollisionHandlers ? (object1, object2) => { thing.triggerCollisionHandlers(object1, object2); } : () => {};

        if (!thing._tileCollider) thing._tileCollider = this.physics.add.collider(thing, this.tileLayers.middle, callback); // thing to collide with map
        if (!thing._actorsCollider) thing._actorsCollider = this.physics.add.overlap(thing, this.actors, callback);
        if (!thing._propsCollider) thing._propsCollider = this.physics.add.overlap(thing, this.props, callback);
    }

    startCauldronUI() {
        this.scene.pause();
        this.scene.launch('CauldronUI');
    }
};
