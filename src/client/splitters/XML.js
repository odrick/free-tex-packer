import Splitter from './Splitter';

import xmlParser from 'xml2js';

class XML extends Splitter {
    static check(data, cb) {
        try {
            xmlParser.parseString(data, (err, atlas) => {
                if(err) {
                    cb(false);
                    return;
                }
                
                cb(atlas.TextureAtlas && Array.isArray(atlas.TextureAtlas.sprite));
            });
        }
        catch(e) {
            cb(false);
        }
    }

    static split(data, options, cb) {
        let res = [];

        try {

            xmlParser.parseString(data, (err, atlas) => {
                if(err) {
                    cb(res);
                    return;
                }

                let list = atlas.TextureAtlas.sprite;
                
                for(let item of list) {
                    item = item['$'];

                    item.x *= 1;
                    item.y *= 1;
                    item.w *= 1;
                    item.h *= 1;
                    item.oX *= 1;
                    item.oY *= 1;
                    item.oW *= 1;
                    item.oH *= 1;

                    let trimmed = item.w < item.oW || item.h < item.oH;
                    
                    res.push({
                        name: Splitter.fixFileName(item.n),
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
                        rotated: item.r === 'y',
                        trimmed: trimmed
                    });
                }
                
                cb(res);
            });
        }
        catch(e) {
        }

        cb(res);
    }

    static get type() {
        return 'XML';
    }
}

export default XML;