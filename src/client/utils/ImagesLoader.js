const UPLOAD_URL = "http://localhost:3000/upload";

class ImagesLoader {

    constructor() {
        this.data = null;
        this.loaded = {};
        
        this.onProgress = null;
        this.onEnd = null;
    }

    load(data, onProgress=null, onEnd=null) {
        this.data = [];
        
        for(let i=0; i<data.length; i++) {
            this.data.push(data[i]);
        }

        this.onProgress = onProgress;
        this.onEnd = onEnd;

        this.loadNext();
    }
    
    loadNext() {
        if(!this.data.length) {
            if(this.onEnd) this.onEnd(this.loaded);
            return;
        }
        
        let item = this.data.pop();
        
        //TODO: cross browser
        let xhr = new XMLHttpRequest();
        let fd = new FormData();
        xhr.open("POST", UPLOAD_URL, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let img = new Image();
                img.src = xhr.responseText;
                this.loaded[item.name] = img;
                
                img.onload = () => this.loadNext();
            }
        };
        fd.append("image", item);
        xhr.send(fd);
    }
}

export default ImagesLoader;