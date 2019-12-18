let MaxRectsPackerEngine = require("maxrects-packer").MaxRectsPacker;
let PACKING_LOGIC = require("maxrects-packer").PACKING_LOGIC;

import Packer from "./Packer";

const METHOD = {
    Smart: "Smart",
    SmartArea: "SmartArea",
    Square: "Square",
    SquareArea: "SquareArea",
    SmartSquare: "SmartSquare",
    SmartSquareArea: "SmartSquareArea"
};

class MaxRectsPacker extends Packer {
    constructor(width, height, allowRotate=false) {
        super();

        this.binWidth = width;
        this.binHeight = height;
        this.allowRotate = allowRotate;
    }

    pack(data, method) {
        let options = {
            smart: (method === METHOD.Smart || method === METHOD.SmartArea || method === METHOD.SmartSquare || method === METHOD.SmartSquareArea),
            pot: false,
            square: (method === METHOD.Square || method === METHOD.SquareArea || method === METHOD.SmartSquare || method === METHOD.SmartSquareArea),
            allowRotation: this.allowRotate,
            logic: (method === METHOD.Smart || method === METHOD.Square || method === METHOD.SmartSquare) ? PACKING_LOGIC.MAX_EDGE : PACKING_LOGIC.MAX_AREA
        };

        let packer = new MaxRectsPackerEngine(this.binWidth, this.binHeight, 0, options);

        let input = [];
        
        for(let item of data) {
            input.push({width: item.frame.w, height: item.frame.h, data: item});
        }

        packer.addArray(input);
        
        let bin = packer.bins[0];
        let rects = bin.rects;
        
        let res = [];
        
        for(let item of rects) {
            item.data.frame.x = item.x;
            item.data.frame.y = item.y;
            if (item.rot) {
                item.data.rotated = true;
            }
            res.push(item.data);
        }
        
        return res;
    }
    
    static get type() {
        return "MaxRectsPacker";
    }

    static get methods() {
        return METHOD;
    }

    static getMethodProps(id='') {
        switch(id) {
            case METHOD.Smart:
                return {name: "Smart edge logic", description: ""};
            case METHOD.SmartArea:
                return {name: "Smart area logic", description: ""};
            case METHOD.Square:
                return {name: "Square edge logic", description: ""};
            case METHOD.SquareArea:
                return {name: "Square area logic", description: ""};
            case METHOD.SmartSquare:
                return {name: "Smart square edge logic", description: ""};
            case METHOD.SmartSquareArea:
                return {name: "Smart square area logic", description: ""};
            default:
                throw Error("Unknown method " + id);
        }
    }
}

export default MaxRectsPacker;