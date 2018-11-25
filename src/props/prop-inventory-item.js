import Prop from './prop';

export default class PropInventoryItem {
    constructor(prop) {
        if (!(prop instanceof Prop)) throw 'prop provide is not of type Prop';
        this._type = prop.constructor.name;

        this._label = prop.label || '';

        let {
            texture,
            frame,
            isTinted,
            tintBottomLeft,
            tintBottomRight,
            tintFill,
            tintTopLeft,
            tintTopRight
        } = prop;

        this._icon = {
            texture,
            frame,
            isTinted,
            tintBottomLeft,
            tintBottomRight,
            tintFill,
            tintTopLeft,
            tintTopRight
        };
    }

    get type () { return this._type; }

    generateIcon (scene, x, y) { 
        let icon = new Phaser.GameObjects.Image(scene, x, y);
        
        icon.texture = this._icon.texture;
        icon.frame = this._icon.frame;

        if (this._icon.isTinted) {
            icon.setTint(this._icon.tintTopLeft, this._icon.tintTopRight, this._icon.tintBottomLeft, this._icon.tintBottomRight);
        }

        return icon;
    }
}