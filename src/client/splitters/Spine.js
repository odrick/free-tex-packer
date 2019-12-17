import Splitter from './Splitter';

class Spine extends Splitter {
    static check(data, cb) {
        let lines = data.split('\n');
        if(lines[0] === undefined || String(lines[0]).trim() !== '') cb(false);
        
        if(String(lines[lines.length-1]).trim() !== '') cb(false);

        cb(lines[2] && lines[2].trim().indexOf('size:') === 0);
    }
    
    static finalizeItem(item) {
        if(item.offset) {
            item.spriteSourceSize = {
                x: item.offset.x,
                y: item.offset.y,
                w: item.frame.w,
                h: item.frame.h
            }
        }
        else {
            item.spriteSourceSize = {x: 0, y: 0, w: item.frame.w, h: item.frame.h};
        }

        item.trimmed = item.frame.w !== item.sourceSize.w || item.frame.h !== item.sourceSize.h;
        
        return item;
    }
    
    static split(data, options, cb) {
        let res = [];

        let lines = data.split('\n');
        
        let currentItem = null;
        
        for(let i=6; i<lines.length; i++) {
            let line = lines[i];
            
            if(!line) continue;
            
            if(line[0].trim()) {
                if(currentItem) {
                    res.push(Spine.finalizeItem(currentItem));
                }
                
                currentItem = {name: Splitter.fixFileName(line.trim())};
            }
            else {
                line = line.trim();
                let parts = line.split(':');
                let name = parts[0].trim();
                let val = parts[1].trim();
                
                let valParts = val.split(',');
                valParts[0] = valParts[0].trim();
                
                if(valParts[1]) valParts[1] = valParts[1].trim();
                
                switch (name) {
                    case "rotate":
                        currentItem.rotated = val === 'true';
                        break;
                    case "xy":
                        if(!currentItem.frame) currentItem.frame = {};
                        currentItem.frame.x = parseInt(valParts[0]);
                        currentItem.frame.y = parseInt(valParts[1]);
                        break;
                    case "size":
                        if(!currentItem.frame) currentItem.frame = {};
                        currentItem.frame.w = parseInt(valParts[0]);
                        currentItem.frame.h = parseInt(valParts[1]);
                        break;
                    case "orig":
                        if(!currentItem.sourceSize) currentItem.sourceSize = {};
                        currentItem.sourceSize.w = parseInt(valParts[0]);
                        currentItem.sourceSize.h = parseInt(valParts[1]);
                        break;
                    case "offset":
                        if(!currentItem.offset) currentItem.offset = {};
                        currentItem.offset.x = parseInt(valParts[0]);
                        currentItem.offset.y = parseInt(valParts[1]);
                        break;
                }
            }
        }

        if(currentItem) {
            res.push(Spine.finalizeItem(currentItem));
        }

        cb(res);
    }

    static get type() {
        return 'Spine';
    }
}

export default Spine;