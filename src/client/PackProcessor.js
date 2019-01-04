import MaxRectsBinPack from './packers/MaxRectsBin';
import Trimmer from './utils/Trimmer';

import I18 from './utils/I18';

class PackProcessor {

    static detectIdentical(rects) {

        let identical = [];
        
        for(let i=0; i<rects.length; i++) {
            let rect1 = rects[i];
            for(let n=i+1; n<rects.length; n++) {
                let rect2 = rects[n];
                if(rect1.image._base64 == rect2.image._base64 && identical.indexOf(rect2) < 0) {
                    rect2.identical = rect1;
                    identical.push(rect2);
                }
            }
        }
        
        for(let rect of identical) {
            rects.splice(rects.indexOf(rect), 1);
        }
        
        return {
            rects: rects,
            identical: identical
        }
    }
    
    static applyIdentical(rects, identical) {
        let clones = [];
        let removeIdentical = [];
        
        for(let item of identical) {
            let ix = rects.indexOf(item.identical);
            if(ix >= 0) {
                let rect = rects[ix];
                
                let clone = Object.assign({}, rect);
                
                clone.name = item.name;
                clone.image = item.image;
                clone.originalFile = item.file;
                clone.skipRender = true;

                removeIdentical.push(item);
                clones.push(clone);
            }
        }

        for(let item of removeIdentical) {
            identical.splice(identical.indexOf(item), 1);
        }
        
        for(let item of clones) {
            item.cloned = true;
            rects.push(item);
        }
        
        return rects;
    }
    
    static pack(images={}, options={}, onComplete=null, onError=null) {

        let rects = [];

        let padding = options.padding || 0;

        let maxWidth = 0, maxHeight = 0;
        let minWidth = 0, minHeight = 0;

        let names = Object.keys(images);
        
        for(let key of names) {
            let img = images[key];

            let name = key.split(".")[0];

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
                name: name,
                file: key,
                image: img
            });
        }

        let width = options.width || 0;
        let height = options.height || 0;

        if(!width) width = maxWidth;
        if(!height) height = maxHeight;

        if (options.powerOfTwo) {
            let sw = Math.round(Math.log(width)/Math.log(2));
            let sh = Math.round(Math.log(height)/Math.log(2));
			
			let pw = Math.pow(2, sw);
            let ph = Math.pow(2, sh);
			
			if(pw < width) pw = Math.pow(2, sw + 1);
			if(ph < height) ph = Math.pow(2, sh + 1);
			
			width = pw;
			height = ph;
        }

        if(width < minWidth || height < minHeight) {
            if(onError) onError({
                description: I18.f("INVALID_SIZE_ERROR", minWidth, minHeight)
            });
            return;
        }

        if(options.allowTrim) {
            Trimmer.trim(rects);
        }

        for(let item of rects) {
            item.frame.w += padding*2;
            item.frame.h += padding*2;
        }
        
        let identical = [];
        
        if(options.detectIdentical) {
            let res = PackProcessor.detectIdentical(rects);

            rects = res.rects;
            identical = res.identical;
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

            if(options.detectIdentical) {
                result = PackProcessor.applyIdentical(result, identical);
            }

            res.push(result);

            for(let item of result) {
                this.removeRect(rects, item.name);
            }
        }

        if(onComplete) {
            onComplete(res);
        }
    }

    static removeRect(rects, name) {
        for(let i=0; i<rects.length; i++) {
            if(rects[i].name === name) {
                rects.splice(i, 1);
                return;
            }
        }
    }
}

export default PackProcessor;