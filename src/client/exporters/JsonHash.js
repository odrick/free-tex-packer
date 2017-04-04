import Json from './Json';

class JsonHash extends Json {

    constructor() {
        super();
    }

    run(data, options) {
        return super.run(data, options, {addPivot: true});
    }

    static get type() {
        return "JSON hash";
    }

    static get description() {
        return "Json hash";
    }

    static get fileExt() {
        return "json";
    }
}

export default JsonHash;