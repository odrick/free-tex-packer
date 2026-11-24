import Splitter from './Splitter';

class Grid extends Splitter {
    static check(data, cb) {
        cb(true);
    }

    static split(data, options, cb) {
        let res = [];
        
        let fw = (options.width + options.padding * 2);
        let fh = (options.height + options.padding * 2);
        
        let cols = Math.floor(options.textureWidth / fw);
        let rows = Math.floor(options.textureHeight / fh);
        
        let nc = (cols * rows) + '';
        
        let ix = 0;
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                let name = ix + '';
                while(name.length < nc.length) name = '0' + name;
                
                res.push({
                    name: Splitter.fixFileName(name),
                    frame: {
                        x: x * fw + options.padding,
                        y: y * fh + options.padding,
                        w: options.width, 
                        h: options.height
                    },
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        w: options.width,
                        h: options.height
                    },
                    sourceSize: {
                        w: options.width,
                        h: options.height
                    },
                    trimmed: false,
                    rotated: false
                });

                ix++;
            }
        }
        
        cb(res);
    }

    static get type() {
        return 'Grid';
    }
}

export default Grid;