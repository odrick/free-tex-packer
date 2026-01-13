import Splitter from './Splitter';

import plist from 'plist';

class PLIST2 extends Splitter {
    static check(data, cb) {
        try {
            this.split(data, null, (res)=>{
                if(res && res.length > 0){
                    cb(true);
                }
            })            
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
                let str
                for (const key in item) {
                    if (Object.hasOwnProperty.call(item, key)) {
                        str = item[key];
                        if(typeof str == "string"){
                            item[key] = str.replace(/{/g, '[').replace(/}/g, ']')
                        }
                    }
                }
                
                let frame = JSON.parse(item.textureRect)
                let offset = JSON.parse(item.spriteOffset)
                let sourceSize = JSON.parse(item.spriteSourceSize)
                
                let trimmed = frame[1][0] < sourceSize[0] ||frame[1][1] < sourceSize[1];
                
                res.push({
                    name: Splitter.fixFileName(name),
                    frame: {
                        x: frame[0][0],
                        y: frame[0][1],
                        w: frame[1][0],
                        h: frame[1][1]
                    },
                    spriteSourceSize: {
                        x: offset[0],
                        y: offset[1],
                        w: frame[1][0],
                        h: frame[1][1]
                    },
                    sourceSize: {
                        w: sourceSize[0],
                        h: sourceSize[1]
                    },
                    trimmed: trimmed,
                    rotated: item.textureRotated
                });
            }
        }
        catch(e) {
        }
        
        cb(res);
    }

    static get type() {
        return 'PLIST2';
    }
}

export default PLIST2;