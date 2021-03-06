import { setupCollisionDetectionOnThing, setOverlapsWithTypeForThing, registerOverlapHanderForThing } from '../generics/actions/collision';

export default class Trigger extends Phaser.GameObjects.Zone {
    constructor(scene) {
        super(scene);

        // for events
        this.events = new Phaser.Events.EventEmitter();

        // need to add an arcade physics body to the zone for collision
        scene.physics.add.existing(this);

        // Collision Detection
        setupCollisionDetectionOnThing(this);
        setOverlapsWithTypeForThing(this, 'actors', true);
        setOverlapsWithTypeForThing(this, 'props', true);

        // generic collision - generates a touched event
        registerOverlapHanderForThing(this, 'generic-touched-trigger-event', (self, other) => {
            this.events.emit('touched', other);
        });
    }

    disable () {
        this.body.enable = false;
        this.body.active = false;
    }

    enable () {
        this.body.enable = true;
        this.body.active = true;
    }

    // when we change the width and height we need to update the body width and height for collisions as well
    setSize (width, height) {
        this.width = width;
        this.height = height;
        this.body.width = width;
        this.body.height = height;
    }
}