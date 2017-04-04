import Json from './Json';

class PhaserHash extends Json {

    constructor() {
        super();
    }

    run(data, options) {
        return super.run(data, options, {addPivot: true});
    }

    static get type() {
        return "Phaser (hash)";
    }

    static get description() {
        return "Phaser (json hash)";
    }

    static get fileExt() {
        return "json";
    }
}

export default PhaserHash;