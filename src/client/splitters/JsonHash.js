import Splitter from './Splitter';

class JsonHash extends Splitter {
    static check(data, cb) {
        try {
            let json = JSON.parse(data);
            cb(json && json.frames && !Array.isArray(json.frames));
        }
        catch(e) {
            cb(false);
        }
    }
    
    static split(data, options, cb) {
        let res = [];

        try {
            let json = JSON.parse(data);
            
            let names = Object.keys(json.frames);
            
            for(let name of names) {
                let item = json.frames[name];

                item.name = Splitter.fixFileName(name);
                res.push(item);
            }
        }
        catch(e) {
        }

        cb(res);
    }

    static get type() {
        return 'JSON (hash)';
    }
}

export default JsonHash;