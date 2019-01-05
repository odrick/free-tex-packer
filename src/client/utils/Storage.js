const PREFIX = "t-packer-";

class Storage {
    
    static save(key, value) {
        key = PREFIX + key;
        
        if(typeof value !== "string") {
            value = JSON.stringify(value);
        }
        
        localStorage.setItem(key, value);
    }
    
    static load(key, isJson=true) {
        key = PREFIX + key;
        
        let value = localStorage.getItem(key);
        
        if(value && isJson) {
            try {
                value = JSON.parse(value);
            }
            catch (e) {
                value = null;
            }
        }
        
        return value;
    }
}

export default Storage;