const PREFIX = "t-packer-";

class Storage {
    
    static save(key, value) {
        key = PREFIX + key;
        
        if(typeof value != "string") {
            value = JSON.stringify(value);
        }
        
        if(window.localStorage) {
            localStorage.setItem(key, value);
        }
        else {
            let exp = new Date();
            exp.setDate(exp.getDate() + 365*10);
            document.cookie = key + "=" + value + "; expires=" + exp.toUTCString();
        }
    }
    
    static load(key, isJson=true) {
        key = PREFIX + key;
        let value = null;

        if(window.localStorage) {
            value = localStorage.getItem(key, value);
        }
        else {
            let prefix = key + "=";
            let startIx = document.cookie.indexOf(prefix);
            if (startIx >= 0) {
                let endIx = document.cookie.indexOf(";", startIx + prefix.length);
                if (endIx == -1) endIx = document.cookie.length;
                value = decodeURIComponent(document.cookie.substring(startIx + prefix.length, endIx));
            }
        }
        
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