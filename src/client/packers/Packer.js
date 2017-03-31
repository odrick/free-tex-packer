const METHOD = {
    Default: "Default"
};

class Packer {

    constructor() {
    }

    pack(data, method) {
        throw Error("Abstarct method. Override it.");
    }


    static get type() {
        return "Default";
    }

    static get methods() {
        return METHOD;
    }

    static getMethodProps(id=0) {
        return {name: "Default", description: "Default placement"};
    }
}

export default Packer;