let MaxRectsPackerEngine = require("maxrects-packer").MaxRectsPacker;

import Packer from "./Packer";
import Rect from "../math/Rect";

const METHOD = {
    Smart: "Smart",
    Square: "Square",
    SmartSquare: "SmartSquare"
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
            smart: (method === METHOD.Smart || method === METHOD.SmartSquare),
            pot: false,
            square: (method === METHOD.Square || method === METHOD.SmartSquare)
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
                return {name: "Smart", description: ""};
            case METHOD.Square:
                return {name: "Square", description: ""};
            case METHOD.SmartSquare:
                return {name: "Smart square", description: ""};
            default:
                throw Error("Unknown method " + id);
        }
    }
}

export default MaxRectsPacker;