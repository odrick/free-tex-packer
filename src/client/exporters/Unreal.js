import Json from './Json';

class Unreal extends Json {

    constructor() {
        super();
    }

    run(data, options) {
        return super.run(data, options, {
            addPivot: true,
            meta: {"target": "paper2d"}
        });
    }

    static get type() {
        return "UnrealEngine";
    }

    static get description() {
        return "UnrealEngine - Paper2d";
    }

    static get fileExt() {
        return "paper2dsprites";
    }
}

export default Unreal;