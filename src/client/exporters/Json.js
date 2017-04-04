import Exporter from './Exporter';

class Json extends Exporter {
    constructor() {
        super();
    }

    run(data, options, jsonOptions={}) {

        let rects = this.prepare(data, options);

        let frames = jsonOptions.isArray ? [] : {};
        let meta = {};

        for(let item of rects) {
            let frame = {
                frame: item.frame,
                rotated: item.rotated,
                trimmed: item.trimmed,
                spriteSourceSize: item.spriteSourceSize,
                sourceSize: item.sourceSize
            };
            
            if(jsonOptions.addPivot) {
                frame.pivot = {x: 0.5, y: 0.5};
            }
            
            if(jsonOptions.isArray) {
                frame.filename = item.name;
                frames.push(frame);
            }
            else {
                frames[item.name] = frame;
            }
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
}

export default Json;