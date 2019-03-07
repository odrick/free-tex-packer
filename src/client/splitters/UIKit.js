import Splitter from './Splitter';

import plist from 'plist';

class UIKit extends Splitter {
    static check(data) {
        try {
            let atlas = plist.parse(data);
            
            if(atlas && atlas.frames) {
                let names = Object.keys(atlas.frames);
                let frame = atlas.frames[names[0]];
                
                if(!frame) return false;
                
                return frame.x !== undefined &&
                       frame.y !== undefined &&
                       frame.w !== undefined &&
                       frame.h !== undefined &&
                       frame.oX !== undefined &&
                       frame.oY !== undefined &&
                       frame.oW !== undefined &&
                       frame.oH !== undefined;
            }
            return false;
        }
        catch(e) {
            return false;
        }
    }
    
    static split(data, options) {
        let res = [];
        
        if(!UIKit.check(data)) return res;

        try {
            let atlas = plist.parse(data);
            let names = Object.keys(atlas.frames);
            
            for(let name of names) {
                let item = atlas.frames[name];
                
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
                    }
                });
            }
        }
        catch(e) {
        }
        
        return res;
    }

    static get type() {
        return 'UIKit';
    }
}

export default UIKit;