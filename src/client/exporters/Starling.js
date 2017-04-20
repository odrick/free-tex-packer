import XML from './XML';

class Starling extends XML {

    constructor() {
        super();
    }

    run(data, options) {

        let {rects, config} = this.prepare(data, options);

        let xml = this.createXML("<TextureAtlas></TextureAtlas>");

        xml.documentElement.setAttribute("imagePath", config.imageName);
        xml.documentElement.setAttribute("width", config.imageWidth);
        xml.documentElement.setAttribute("height", config.imageWidth);

        let info = [];
        info.push("");
        info.push("Created with " + this.appInfo.displayName + " v" + this.appInfo.version + " " + this.appInfo.url);
        info.push("");
        xml.append(xml.createComment(info.join("\n")));

        for(let item of rects) {

            let node = xml.createElement("SubTexture");
            node.setAttribute("name", item.name);
            node.setAttribute("x", item.frame.x);
            node.setAttribute("y", item.frame.y);

            if(item.rotated) {
                node.setAttribute("rotated", true);
                node.setAttribute("width", item.frame.h);
                node.setAttribute("height", item.frame.w);
            }
            else {
                node.setAttribute("width", item.frame.w);
                node.setAttribute("height", item.frame.h);
            }
            
            node.setAttribute("frameX", -item.spriteSourceSize.x);
            node.setAttribute("frameY", -item.spriteSourceSize.y);
            node.setAttribute("frameWidth", item.sourceSize.w);
            node.setAttribute("frameHeight", item.sourceSize.h);

            xml.documentElement.append(node);
        }

        return this.getXMLString(xml);
    }

    static get type() {
        return "Starling";
    }

    static get description() {
        return "Starling format";
    }

    static get fileExt() {
        return "xml";
    }
    
}

export default Starling;