import appInfo from '../../../package.json';

let prettyData = require('pretty-data').pd;

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
        
        return {rects: ret, config: opt};
    }
    
    createXML(rootString) {
        let xml = null;

        if (typeof window.DOMParser != "undefined")
        {
            xml = (new window.DOMParser()).parseFromString(rootString, "text/xml");
        }
        else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM"))
        {
            xml = new window.ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(rootString);
        }
        else
        {
            throw new Error("No XML parser found");
        }

        return xml;
    }
    
    getXMLString(xml, additionalHeader="") {
        let str = '<?xml version="1.0" encoding="UTF-8"?>' + "\n";
        if(additionalHeader) {
            str += additionalHeader + "\n";
        }
        str += (new XMLSerializer()).serializeToString(xml)
        
        return prettyData.xml(str);
    }

    static get fileExt() {
        return "txt";
    }
}

export default Exporter;