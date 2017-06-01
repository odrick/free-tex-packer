import appInfo from '../../../package.json';

class Exporter {

    constructor() {
        this.appInfo = appInfo;
    }

    run(data, options) {
        
    }
    
    prepare(data, options) {

        let opt = Object.assign({}, options);

        opt.imageName = opt.imageName || "texture.png";
        opt.format = opt.format || "RGBA8888";
        opt.scale = opt.scale || 1;
        
        let ret = [];

        for(let item of data) {
            
            let name = item.name;
            
            if(options.trimSpriteNames) {
                name.trim();
            }

            if(options.removeFileExtension) {
                let parts = name.split(".");
                parts.pop();
                name = parts.join(".");
            }

            if(!options.prependFolderName) {
                name = name.split("/").pop();
            }

            let frame = {x: item.frame.x, y: item.frame.y, w: item.frame.w, h: item.frame.h};
            let spriteSourceSize = {x: item.spriteSourceSize.x, y: item.spriteSourceSize.y, w: item.spriteSourceSize.w, h: item.spriteSourceSize.h};
            let sourceSize = {w: item.sourceSize.w, h: item.sourceSize.h};
            
            ret.push({
                name: name,
                frame: frame,
                spriteSourceSize: spriteSourceSize,
                sourceSize: sourceSize,
                rotated: item.rotated,
                trimmed: item.trimmed
            });
            
        }
        
        return {rects: ret, config: opt};
    }

    static get fileExt() {
        return "txt";
    }
    
    static get allowTrim() {
        return true;
    }

    static get allowRotation() {
        return true;
    }
}

export default Exporter;