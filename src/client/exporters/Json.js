import Exporter from './Exporter';
import prettyData from 'pretty-data';

class Json extends Exporter {
    constructor() {
        super();
    }

    run(data, options, jsonOptions={}) {
        let {rects, config} = this.prepare(data, options);
        
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
        
        let image = "";
        if(config.base64Export) {
            if(config.textureFormat == "png") image = "data:image/png;base64," + config.imageData;
            if(config.textureFormat == "jpg") image = "data:image/jpeg;base64," + config.imageData;
        }
        else {
            image = config.imageName;
        }
        
        meta.image = image;
        meta.format = config.format;
        meta.size = {w: config.imageWidth, h: config.imageHeight};
        meta.scale = config.scale;
        
        if(jsonOptions.meta) {
            meta = Object.assign(meta, jsonOptions.meta);
        }

        let res = {
            frames: frames,
            meta: meta
        };

        return prettyData.pd.json(JSON.stringify(res));
    }
}

export default Json;