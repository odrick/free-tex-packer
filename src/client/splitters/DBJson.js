import Splitter from './Splitter';

class DBJson extends Splitter {
    static check(data, cb) {
        cb(data.indexOf('"SubTexture"') !== -1 && data.indexOf('"imagePath"') !== -1);
    }

    static finalizeItem(item) {
        item.spriteSourceSize = {
            x: item.frameX,
            y: item.frameY,
            w: item.frameWidth,
            h: item.frameHeight
        }

        item.trimmed = item.frame.w !== item.width || item.frame.h !== item.height;

        return item;
    }

    static split(data, options, cb) {
        let res = [];

        try {
            let json = JSON.parse(data);

            for (let i = 0; i < json.SubTexture.length; i++) {
                const element = json.SubTexture[i];

                let trimmed = element.frameX || element.frameY || element.frameWidth < element.width || element.frameHeight < element.height;
                res.push({
                    name: Splitter.fixFileName(element.name),
                    frame: {
                        x: element.x,
                        y: element.y,
                        w: element.width,
                        h:  element.height,
                    },
                    spriteSourceSize: {
                        x: element.frameX ? -element.frameX : 0,
                        y: element.frameY ? -element.frameY : 0,
                        w:  element.width,
                        h:  element.height
                    },
                    sourceSize: {
                       w: element.frameWidth ? element.frameWidth : element.width,
                        h: element.frameHeight ? element.frameHeight : element.height
                    },
                    trimmed: trimmed,
                    rotated: false//element.textureRotated
                });
            }
        }
        catch (e) {
        }

        cb(res);
    }

    static get type() {
        return 'DBJson(龙骨)';
    }

    static get inverseRotation() {
        return true;
    }
}

export default DBJson;