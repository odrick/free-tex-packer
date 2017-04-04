import Exporter from './Exporter';

class XML extends Exporter {
    run(data, options) {

        let rects = this.prepare(data, options);

        let xml = this.createXML("<TextureAtlas></TextureAtlas>");
        
        let info = [];
        info.push(" Created with " + this.appInfo.name + " v" + this.appInfo.version + " " + this.appInfo.url + " ");
        info.push("Format:");
        info.push("n  => name");
        info.push("x  => x pos");
        info.push("y  => y pos");
        info.push("w  => width");
        info.push("h  => height");
        info.push("pX => x pos of the pivot point");
        info.push("pY => y pos of the pivot point");
        info.push("oX => x-corner offset");
        info.push("oY => y-corner offset");
        info.push("oW => original width");
        info.push("oH => original height");
        info.push("r => 'y' if sprite is rotated");

        xml.append(xml.createComment(info.join("\n")));

        for(let item of rects) {

            let node = xml.createElement("sprite");
            node.setAttribute("n", item.name);
            node.setAttribute("x", item.frame.x);
            node.setAttribute("y", item.frame.y);
            node.setAttribute("w", item.frame.w);
            node.setAttribute("h", item.frame.h);
            node.setAttribute("pX", 0.5);
            node.setAttribute("pY", 0.5);
            
            if(item.trimmed) {
                node.setAttribute("oX", item.spriteSourceSize.x);
                node.setAttribute("oY", item.spriteSourceSize.y);
                node.setAttribute("oW", item.sourceSize.w);
                node.setAttribute("oH", item.sourceSize.h);
            }
            
            if(item.rotated) {
                node.setAttribute("r", "y");
            }

            xml.documentElement.append(node);
        }
        
        console.log(xml);
        
        return this.getXMLString(xml);
    }

    static get type() {
        return "XML plain";
    }

    static get description() {
        return "Plain XML format";
    }

    static get fileExt() {
        return "xml";
    }
}

export default XML;