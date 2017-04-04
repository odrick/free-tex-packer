import Json from './Json';

class JsonArray extends Json {

    constructor() {
        super();
    }

    run(data, options) {
        return super.run(data, options, {addPivot: true, isArray: true});
    }

    static get type() {
        return "JSON array";
    }

    static get description() {
        return "Json array";
    }

    static get fileExt() {
        return "json";
    }
}

export default JsonArray;