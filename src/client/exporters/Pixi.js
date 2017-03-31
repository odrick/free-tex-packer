import Exporter from './Exporter';

class Pixi extends Exporter {

    constructor() {
        super();
    }

    run(data, options) {
        let scale = options.scale || 1;

        let frames = {};
        let meta = {};

        for(let item of data) {

            let frame = {x: item.frame.x/scale, y: item.frame.y/scale, w: item.frame.w/scale, h: item.frame.h/scale};
            let spriteSourceSize = {x: item.spriteSourceSize.x/scale, y: item.spriteSourceSize.y/scale, w: item.spriteSourceSize.w/scale, h: item.spriteSourceSize.h/scale};
            let sourceSize = {w: item.sourceSize.w/scale, h: item.sourceSize.h/scale};

            frames[item.name] = {
                frame: frame,
                rotated: item.rotated,
                trimmed: item.trimmed,
                spriteSourceSize: spriteSourceSize,
                sourceSize: sourceSize
            };
        }

        meta.app = this.appInfo.url;
        meta.version = this.appInfo.version;
        meta.image = options.imageName || "texture.png";
        meta.format = options.format || "RGBA8888";
        meta.size = {w: options.imageWidth, h: options.imageHeight};
        meta.scale = scale;

        let res = {
            frames: frames,
            meta: meta
        };

        return JSON.stringify(res, null, 2);
    }

    static get type() {
        return "pixi.js";
    }

    static get description() {
        return "pixi.js format";
    }

    static get fileExt() {
        return "json";
    }
}

export default Pixi;