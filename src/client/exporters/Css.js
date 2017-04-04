import Exporter from './Exporter';

class Css extends Exporter {

    constructor() {
        super();
    }
    
    static addWendorStyle(styles, prop, val) {
        let prefix = ["", "-moz-", "-ms-", "-webkit-", "-o-"];
        
        for(let p of prefix) {
            styles.push(p+prop + ":" + val);
        }
    }

    run(data, options) {
        let {rects, config} = this.prepare(data, options);
        
        let image = config.imageName || "texture.png";
        
        let frames = [];

        for(let item of rects) {
            let styles = [];
            styles.push("display:inline-block");
            styles.push("overflow:hidden");

            styles.push("background:url("+image+") no-repeat -" + item.frame.x + "px -" + item.frame.y + "px");
            
            if(item.rotated) {
                styles.push("width:" + item.frame.h + "px");
                styles.push("height:" + item.frame.w + "px");

                Css.addWendorStyle(styles, "transform-origin", (item.frame.h/2) + "px " + (item.frame.h/2) + "px");
                Css.addWendorStyle(styles, "transform", "rotate(-90deg)");
            }
            else {
                styles.push("width:" + item.frame.w + "px");
                styles.push("height:" + item.frame.h + "px");
            }

            if(item.trimmed) {
                styles.push("margin-left:" + item.spriteSourceSize.x + "px");
                styles.push("margin-top:" + item.spriteSourceSize.y + "px");
            }
            
            frames.push("." + item.name + " {" + styles.join(";") + "}");
        }

        let ret = "";
        
        ret += "/*\n";
        ret += "   ---------------------------\n";
        ret += "   created with " + this.appInfo.name + " v" + this.appInfo.version + "\n";
        ret += "   " + this.appInfo.url + "\n";
        ret += "   ---------------------------\n";
        ret += "*/\n\n";
        
        ret += frames.join("\n");
        
        return ret;
    }

    static get type() {
        return "css";
    }

    static get description() {
        return "css format";
    }

    static get fileExt() {
        return "css";
    }
}

export default Css;