import actorConfig from '../../config/actor';

import Actor from '../actor';

import Standing from './player-movement-state/standing';

import Idle from './player-action-state/idle';

import Potion from '../../props/prop-dynamic/potion';

export default class Player extends Actor {
    constructor (scene, x = 0, y = 0) {
        super(scene, x, y, actorConfig.player.startingKey, actorConfig.player.startingFrame);

        this.config = actorConfig.player;

        // setup attributes
        this.attributes.bounce.value = this.config.attributes.bounce;
        this.attributes.gravity.value = this.config.attributes.gravity;
        this.attributes.jumpDuration.value = this.config.attributes.jumpDuration;
        this.attributes.jumpVelocity.value = this.config.attributes.jumpVelocity;
        this.attributes.strength.value = this.config.attributes.strength;
        this.attributes.walkVelocity.value = this.config.attributes.walkVelocity;

        // setup player animations
        Object.keys(this.config.anims).forEach(animKey => {
            this.scene.anims.create(this.config.anims[animKey]);
        });

        // setup our potion pool
        this.potions = this.scene.add.group({
            classType: Potion,
            maxSize: 1,
            runChildUpdate: true
        });

        // start our player standing, other states will be added as needed
        this.movement.start(Standing, { "player": this });

        // start our player action as idle, other states will be added as needed
        this.action.start(Idle, { "player": this });
    }

    setMovementStanding () {
        this.movement.setState(Standing, { "player": this });
    }

    // will only be invoked if added to gameobject (not just physics object)
    preUpdate (time, delta) {
        this.movement.update({ "player": this });

        this.action.update({ "player": this });

        if (super.preUpdate) super.preUpdate(time, delta);
    }
}