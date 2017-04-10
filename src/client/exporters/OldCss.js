import Exporter from './Exporter';

class OldCss extends Exporter {

    constructor() {
        super();
    }

    static addWendorStyle(styles, prop, val) {
        let prefix = ["", "-moz-", "-ms-", "-webkit-", "-o-"];

        for(let p of prefix) {
            styles.push(p+prop + ":" + val);
        }
    }

    run(data, options={}) {

        options.removeFileExtension = true;
        let {rects, config} = this.prepare(data, options);

        let image = config.imageName || "texture.png";

        let frames = [];

        for(let item of rects) {
            let styles = [];
            styles.push("display:inline-block");
            styles.push("overflow:hidden");

            styles.push("background:url("+image+") no-repeat -" + item.frame.x + "px -" + item.frame.y + "px");
            styles.push("width:" + item.frame.w + "px");
            styles.push("height:" + item.frame.h + "px");

            if(item.trimmed) {
                styles.push("margin-left:" + item.spriteSourceSize.x + "px");
                styles.push("margin-top:" + item.spriteSourceSize.y + "px");
            }

            frames.push("." + item.name + " {" + styles.join(";") + "}");
        }

        let ret = "";

        ret += "/*\n";
        ret += "   ---------------------------\n";
        ret += "   created with " + this.appInfo.displayName + " v" + this.appInfo.version + "\n";
        ret += "   " + this.appInfo.url + "\n";
        ret += "   ---------------------------\n";
        ret += "*/\n\n";

        ret += frames.join("\n");

        return ret;
    }

    static get type() {
        return "old css";
    }

    static get description() {
        return "old css format";
    }

    static get fileExt() {
        return "css";
    }
    
    static get allowRotation() {
        return false;
    }
}

export default OldCss;