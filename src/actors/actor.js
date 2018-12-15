import StateMachine from '../generics/state-machine';

import Walker from './mixin/walker';
import Jumper from './mixin/jumper';
import Thrower from './mixin/thrower';
import Collider from './mixin/collider';
import Inventory from './mixin/inventory';

import Attributes from '../generics/attributes';
import Bounce from './attributes/bounce';
import Gravity from './attributes/gravity';
import JumpDuration from './attributes/jump-duration';
import JumpVelocity from './attributes/jump-velocity';
import Strength from './attributes/strength';
import WalkVelocity from './attributes/walk-velocity';

export default class Actor extends
    Collider ( Walker ( Jumper ( Thrower ( Inventory (
        Phaser.Physics.Arcade.Sprite 
    ) ) ) ) ) {
    constructor (scene, x = 0, y = 0, key, frame) {
        super(scene, x, y, key, frame);

        this._movementState = new StateMachine();

        this._actionState = new StateMachine();

        // setup physics body for this actor
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // actors collide with world bounds
        this.setCollideWorldBounds(true);

        // attributes
        this._attributes = new Attributes();
        this._attributes.addAttribute(new Bounce(this));
        this._attributes.addAttribute(new Gravity(this));
        this._attributes.addAttribute(new JumpDuration(this));
        this._attributes.addAttribute(new JumpVelocity(this));
        this._attributes.addAttribute(new Strength(this));
        this._attributes.addAttribute(new WalkVelocity(this));
    }

    get movement () { return this._movementState }

    get action () { return this._actionState }

    get attributes () { return this._attributes }
}