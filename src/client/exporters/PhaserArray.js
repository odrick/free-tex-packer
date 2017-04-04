import Json from './Json';

class PhaserArray extends Json {

    constructor() {
        super();
    }

    run(data, options) {
        return super.run(data, options, {addPivot: true, isArray: true});
    }

    static get type() {
        return "Phaser (array)";
    }

    static get description() {
        return "Phaser (json array)";
    }

    static get fileExt() {
        return "json";
    }
}

export default PhaserArray;