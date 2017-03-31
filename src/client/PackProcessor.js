import MaxRectsBinPack from './packers/MaxRectsBin';
import Trimmer from './utils/Trimmer';

class PackProcessor {

    static pack(images={}, options={}) {

        let rects = [];

        let padding = options.padding || 0;

        let maxWidth = 0, maxHeight = 0;
        let minWidth = 0, minHeight = 0;

        for(let key in images) {
            let img = images[key];

            maxWidth += img.width;
            maxHeight += img.height;

            if(img.width > minWidth) minWidth = img.width + padding*2;
            if(img.height > minHeight) minHeight = img.height + padding*2;

            rects.push({
                frame: {x: 0, y: 0, w: img.width, h: img.height},
                rotated: false,
                trimmed: false,
                spriteSourceSize: {x: 0, y: 0, w: img.width, h: img.height},
                sourceSize: {w: img.width, h: img.height},
                name: key,
                image: img
            });
        }

        let width = options.width || 0;
        let height = options.height || 0;

        if(!width) width = maxWidth;
        if(!height) height = maxHeight;

        if(width < minWidth || height < minHeight) {
            return {error: 1, description: "Invalid size. Min: " + minWidth + "x" + minHeight};
        }

        if(options.allowTrim) {
            Trimmer.trim(rects);
        }

        for(let item of rects) {
            item.frame.w += padding*2;
            item.frame.h += padding*2;
        }

        let packerClass = options.packer || MaxRectsBinPack;
        let packerMethod = options.packerMethod || MaxRectsBinPack.methods.BestShortSideFit;

        let res = [];

        while(rects.length) {
            let packer = new packerClass(width, height, options.allowRotation);
            let result = packer.pack(rects, packerMethod);

            for(let item of result) {
                item.frame.x += padding;
                item.frame.y += padding;
                item.frame.w -= padding*2;
                item.frame.h -= padding*2;
            }

            res.push(result);

            for(let item of result) {
                this.removeRect(rects, item.name);
            }
        }

        return res;
    }

    static removeRect(rects, name) {
        for(let i=0; i<rects.length; i++) {
            if(rects[i].name == name) {
                rects.splice(i, 1);
                return;
            }
        }
    }
}

export default PackProcessor;