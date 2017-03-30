class ImagesLoader {

    constructor(basePath="") {
        this.loaded = {};
        this.data = null;
        this.basePath = (basePath.substr(basePath.length-1, 1) == "/") ? basePath : basePath + "/";

        this.onProgress = null;
        this.onEnd = null;
    }

    load(data, onProgress=null, onEnd=null) {
        this.data = data;

        this.onProgress = onProgress;
        this.onEnd = onEnd;

        for(let item of this.data) {
            let img = new Image();
            img.src = this.basePath + item;
            this.loaded[item] = img;
        }

        this.wait();
    }

    wait() {
        let itemsLoaded = 0;
        let itemsTotal = 0;
        for(let key in this.loaded) {
            if(this.loaded[key].complete)	itemsLoaded++;
            itemsTotal++;
        }

        if(itemsLoaded >= itemsTotal) {
            if(this.onEnd) this.onEnd(this.loaded);
        }
        else {
            if(this.onProgress) this.onProgress(Math.floor(itemsLoaded / itemsTotal));
            setTimeout(() => this.wait(), 50);
        }
    }
}

export default ImagesLoader;