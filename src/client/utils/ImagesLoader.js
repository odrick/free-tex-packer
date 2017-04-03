import appInfo from '../../../package.json';

class ImagesLoader {

    constructor() {
        this.data = null;
        this.loaded = {};
        this.loadedCnt = 0;
        
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
        
        let item = this.data.shift();
        
        //TODO: cross browser
        let xhr = new XMLHttpRequest();
        let fd = new FormData();
        xhr.open("POST", appInfo["base64-proxy"], true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let img = new Image();
                
                img.src = xhr.responseText;
                img._base64 = xhr.responseText;
                img._ix = this.loadedCnt;
                
                this.loaded[item.name] = img;
                this.loadedCnt++;

                if(this.onProgress) {
                    this.onProgress(this.loadedCnt / (this.loadedCnt + this.data.length));
                }
                
                img.onload = () => this.loadNext();
            }
        };
        fd.append("input_file", item);
        xhr.send(fd);
    }
}

export default ImagesLoader;