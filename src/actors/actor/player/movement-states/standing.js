import State from '../../../../generics/state';
import ChangeState from '../../../../generics/state-action/change-state';

import { isActorWalkingRight, isActorWalkingLeft, stopActorWalking, updateWalkingActor } from '../../../actions/movement';

import WalkingRight from './walking-right';
import WalkingLeft from './walking-left';
import Jumping from './jumping';

export default class Standing extends State {
    init (data) {
        // set player using destructuring
        let { player } = data;

        // set right, altRight, left, altLeft and jump using destructuring
        let { "scene": { "inputKeys": { "right": right, "altRight": altRight, "left": left, "altLeft": altLeft, "jump": jump } } } = player;

        let standingAnimation = isActorWalkingLeft(player) ? 'left' : isActorWalkingRight(player) ? 'right' : ''; 
        this.setStandingAnimation(player, standingAnimation); 

        stopActorWalking(player);

        return super.init(data);
    }

    run (data) {
        let { player, time, delta } = data;

        let { "scene": { "inputKeys": { "right": right, "altRight": altRight, "left": left, "altLeft": altLeft, "jump": jump } }, body } = player;

        if (player.canMove) {
            if (right.isDown || altRight.isDown) return new ChangeState(WalkingRight, { "player": player });

            if (left.isDown || altLeft.isDown ) return new ChangeState(WalkingLeft, { "player": player });

            if (jump.isDown && body.onFloor()) return new ChangeState(Jumping, { "player": player });

            updateWalkingActor(player, time, delta);
        }
        
        return super.run(data);
    }

    setStandingAnimation (player, facing = '') {
        // set animateStandingLeft and animateStandingRight using destructuring
        let { "config": { "anims": { "standLeft": { "key": animateStandingLeft }, "standRight": { "key": animateStandingRight } } } } = player;

        switch (facing) {
            case 'left':
                player.play(animateStandingLeft);
                break;
            case 'right':
                player.play(animateStandingRight);
                break;
        }
    }
}