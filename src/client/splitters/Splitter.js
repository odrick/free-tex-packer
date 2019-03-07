class Splitter {
    static check(data) {
    }
    
    static split(data, options) {
    }
    
    static get type() {
        return 'Default';
    }
    
    static fixFileName(name) {
        let validExts = ['png', 'jpg', 'jpeg'];
        let ext = name.split('.').pop().toLowerCase();
        
        if(validExts.indexOf(ext) < 0) name += '.png';
        
        return name;
    }
}

export default Splitter;