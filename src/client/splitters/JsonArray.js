import Splitter from './Splitter';

class JsonArray extends Splitter {
    static check(data) {
        try {
            let json = JSON.parse(data);
            if(json && json.frames && Array.isArray(json.frames)) return true;
        }
        catch(e) {
        }

        return false;
    }

    static split(data, options) {
        let res = [];

        try {
            let json = JSON.parse(data);

            for(let item of json.frames) {
                item.name = Splitter.fixFileName(item.filename);
                res.push(item);
            }
        }
        catch(e) {
        }

        return res;
    }

    static get type() {
        return 'JSON (array)';
    }
}

export default JsonArray;