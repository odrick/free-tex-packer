import Packer from "./Packer";

const METHOD = {
    Automatic: "Automatic"
};

class OptimalPacker extends Packer {
    constructor(width, height, allowRotate=false) {
        super();
    }

    pack(data, method) {
        throw new Error('OptimalPacker is a dummy and cannot be used directly');
    }
    
    static get type() {
        return "OptimalPacker";
    }

    static get methods() {
        return METHOD;
    }

    static getMethodProps(id='') {
        switch(id) {
            case METHOD.Automatic:
                return {name: "Automatic", description: ""};
            default:
                throw Error("Unknown method " + id);
        }
    }
}

export default OptimalPacker;