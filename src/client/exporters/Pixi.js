import Exporter from './Exporter';

class Pixi extends Exporter {

    constructor() {
        super();
    }

    run(data, options) {
        
        let rects = this.prepare(data, options);

        let frames = {};
        let meta = {};

        for(let item of rects) {
            frames[item.name] = {
                frame: item.frame,
                rotated: item.rotated,
                trimmed: item.trimmed,
                spriteSourceSize: item.spriteSourceSize,
                sourceSize: item.sourceSize
            };
        }

        meta.app = this.appInfo.url;
        meta.version = this.appInfo.version;
        meta.image = options.imageName || "texture.png";
        meta.format = options.format || "RGBA8888";
        meta.size = {w: options.imageWidth, h: options.imageHeight};
        meta.scale = options.scale || 1;

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