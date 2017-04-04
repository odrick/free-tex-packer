import Exporter from './Exporter';

class Cocos2d extends Exporter {
    
    constructor() {
        super();
    }
    
    run(data, options) {

        let {rects, config} = this.prepare(data, options);

        let xml = this.createXML("<plist></plist>");

        xml.documentElement.setAttribute("version", "1.0");
        
        let rootDict = xml.createElement("dict");
        xml.documentElement.append(rootDict);
        
        let node = xml.createElement("key");
        node.textContent = "frames";
        rootDict.append(node);
        
        let framesDict = xml.createElement("dict");
        rootDict.append(framesDict);

        for(let item of rects) {
            node = xml.createElement("key");
            node.textContent = item.name;
            framesDict.append(node);
            
            let itemDict = xml.createElement("dict");

            this.addValue(xml, itemDict, "aliases", "array");
            //FIXME: wtf?
            this.addValue(xml, itemDict, "spriteOffset", "string", (item.trimmed ? "{-1,0}" : "{0,0}"));
            this.addValue(xml, itemDict, "spriteSize", "string", "{"+item.frame.w+","+item.frame.h+"}");
            this.addValue(xml, itemDict, "spriteSourceSize", "string", "{"+item.sourceSize.w+","+item.sourceSize.h+"}");
            this.addValue(xml, itemDict, "textureRect", "string", "{" + "{"+item.frame.x+","+item.frame.y+"}" + "," + "{"+item.frame.w+","+item.frame.h+"}" + "}");
            this.addValue(xml, itemDict, "textureRotated", (item.rotated ?  "true" : "false"));
            
            framesDict.append(itemDict);
        }

        node = xml.createElement("key");
        node.textContent = "metadata";
        rootDict.append(node);

        let metaDict = xml.createElement("dict");
        rootDict.append(metaDict);

        this.addValue(xml, metaDict, "format", "integer", 3);
        this.addValue(xml, metaDict, "pixelFormat", "string", config.format);
        this.addValue(xml, metaDict, "premultiplyAlpha", "false");
        this.addValue(xml, metaDict, "realTextureFileName", "string", config.imageName);
        this.addValue(xml, metaDict, "size", "string", "{"+config.imageWidth+","+config.imageHeight+"}");
        this.addValue(xml, metaDict, "textureFileName", "string", config.imageName);
        
        console.log(xml);

        let header = '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';
        return this.getXMLString(xml, header);
    }
    
    addValue(xml, root, name, type, value) {
        let key = xml.createElement("key");
        key.textContent = name;
        root.append(key);
        
        let val = xml.createElement(type);
        if(value !== undefined) val.textContent = value;
        root.append(val);
    }

    static get type() {
        return "cocos2d";
    }

    static get description() {
        return "cocos2d format";
    }

    static get fileExt() {
        return "plist";
    }
    
}

export default Cocos2d;