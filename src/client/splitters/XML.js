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
                    
                    res.push({
                        name: Splitter.fixFileName(item.n),
                        frame: {
                            x: item.x * 1,
                            y: item.y * 1,
                            w: item.w * 1,
                            h: item.h * 1
                        },
                        spriteSourceSize: {
                            x: item.oX * 1,
                            y: item.oY * 1,
                            w: item.w * 1,
                            h: item.h * 1
                        },
                        sourceSize: {
                            w: item.oW * 1,
                            h: item.oH * 1
                        },
                        rotated: item.r === 'y'
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