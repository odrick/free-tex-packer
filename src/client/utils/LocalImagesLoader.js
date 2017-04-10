class LocalImagesLoader {

    constructor() {
        this.data = null;
        this.loaded = {};
        this.loadedCnt = 0;

        this.onProgress = null;
        this.onEnd = null;

        this.waitImages = this.waitImages.bind(this);
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
            this.waitImages();
            return;
        }

        let item = this.data.shift();

        let img = new Image();

        let reader = new FileReader();
        reader.onload = e => {
            img.src = e.target.result;
            img._base64 = e.target.result;

            this.loaded[item.name] = img;
            this.loadedCnt++;

            if(this.onProgress) {
                this.onProgress(this.loadedCnt / (this.loadedCnt + this.data.length));
            }

            this.loadNext();
        };
        reader.readAsDataURL(item);
    }

    waitImages() {
        let ready = true;

        for(let key of Object.keys(this.loaded)) {
            if(!this.loaded[key].complete) {
                ready = false;
                break;
            }
        }

        if(ready) {
            if(this.onEnd) this.onEnd(this.loaded);
        }
        else {
            setTimeout(this.waitImages, 50);
        }
    }
}

export default LocalImagesLoader;