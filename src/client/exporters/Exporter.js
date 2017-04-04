import appInfo from '../../../package.json';

class Exporter {

    constructor() {
        this.appInfo = appInfo;
    }

    run(data, options) {
        
    }
    
    prepare(data, options) {
        
        let ret = [];
        let scale = options.scale || 1;
        
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

            let frame = {x: item.frame.x/scale, y: item.frame.y/scale, w: item.frame.w/scale, h: item.frame.h/scale};
            let spriteSourceSize = {x: item.spriteSourceSize.x/scale, y: item.spriteSourceSize.y/scale, w: item.spriteSourceSize.w/scale, h: item.spriteSourceSize.h/scale};
            let sourceSize = {w: item.sourceSize.w/scale, h: item.sourceSize.h/scale};
            
            ret.push({
                name: name,
                frame: frame,
                spriteSourceSize: spriteSourceSize,
                sourceSize: sourceSize,
                rotated: item.rotated,
                trimmed: item.trimmed
            });
            
        }
        
        return ret;
    }

    static get fileExt() {
        return "txt";
    }
}

export default Exporter;