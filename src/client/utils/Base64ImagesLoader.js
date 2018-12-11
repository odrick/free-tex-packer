class Base64ImagesLoader {
    constructor() {
        this.loaded = {};

        this.onProgress = null;
        this.onEnd = null;

        this.waitImages = this.waitImages.bind(this);
    }

    load(data, onProgress=null, onEnd=null) {
        this.data = data.slice();
        
        this.onProgress = onProgress;
        this.onEnd = onEnd;
        
        for(let item of data) {
            let img = new Image();
            img.src = item.url;
            img._base64 = item.url;

            this.loaded[item.name] = img;
        }
        
        this.waitImages();
    }

    waitImages() {
        let ready = true;
        let loaded = 0;
        let keys = Object.keys(this.loaded);
        
        for(let key of keys) {
            if(!this.loaded[key].complete) {
                ready = false;
            }
            else {
                loaded++;
            }
        }

        if(ready) {
            if(this.onEnd) this.onEnd(this.loaded);
        }
        else {
            if(this.onProgress) this.onProgress(loaded / keys.length);
            setTimeout(this.waitImages, 50);
        }
    }
}

export default Base64ImagesLoader;