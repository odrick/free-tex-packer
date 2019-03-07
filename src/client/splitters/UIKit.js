import Splitter from './Splitter';

import plist from 'plist';

class UIKit extends Splitter {
    static check(data, cb) {
        try {
            let atlas = plist.parse(data);
            
            if(atlas && atlas.frames) {
                let names = Object.keys(atlas.frames);
                let frame = atlas.frames[names[0]];
                
                if(!frame) {
                    cb(false);
                    return;
                }
                
                cb(frame.x !== undefined &&
                   frame.y !== undefined &&
                   frame.w !== undefined &&
                   frame.h !== undefined &&
                   frame.oX !== undefined &&
                   frame.oY !== undefined &&
                   frame.oW !== undefined &&
                   frame.oH !== undefined);
            }
            
            cb(false);
        }
        catch(e) {
            cb(false);
        }
    }
    
    static split(data, options, cb) {
        let res = [];

        try {
            let atlas = plist.parse(data);
            let names = Object.keys(atlas.frames);
            
            for(let name of names) {
                let item = atlas.frames[name];
                
                let trimmed = item.w < item.oW || item.h < item.oH;
                
                res.push({
                    name: Splitter.fixFileName(name),
                    frame: {
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h
                    },
                    spriteSourceSize: {
                        x: item.oX,
                        y: item.oY,
                        w: item.w,
                        h: item.h
                    },
                    sourceSize: {
                        w: item.oW,
                        h: item.oH
                    },
                    trimmed: trimmed,
                    rotated: false
                });
            }
        }
        catch(e) {
        }
        
        cb(res);
    }

    static get type() {
        return 'UIKit';
    }
}

export default UIKit;