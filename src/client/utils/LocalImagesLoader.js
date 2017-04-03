class LocalImagesLoader {

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

        let img = new Image();

        let reader = new FileReader();
        reader.onload = e => {
            img.src = e.target.result;
            img._base64 = e.target.result;
            img._ix = this.loadedCnt;

            this.loaded[item.name] = img;
            this.loadedCnt++;

            if(this.onProgress) {
                this.onProgress(this.loadedCnt / (this.loadedCnt + this.data.length));
            }

            img.onload = () => this.loadNext();
        };
        reader.readAsDataURL(item);
    }
    
}

export default LocalImagesLoader;