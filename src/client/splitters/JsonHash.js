import Splitter from './Splitter';

class JsonHash extends Splitter {
    static check(data) {
        try {
            let json = JSON.parse(data);
            if(json && json.frames && !Array.isArray(json.frames)) return true;
        }
        catch(e) {
        }
        
        return false;
    }
    
    static split(data, options) {
        let res = [];

        if(!JsonHash.check(data)) return res;

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
        
        return res;
    }

    static get type() {
        return 'JSON (hash)';
    }
}

export default JsonHash;