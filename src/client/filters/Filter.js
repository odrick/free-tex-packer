class Filter {
    constructor() {
    }

    apply(buffer) {

        let retCanvas = document.createElement("canvas");
        let retCtx = retCanvas.getContext("2d");

        retCanvas.width = buffer.width;
        retCanvas.height = buffer.height;

        let bufferCtx = buffer.getContext("2d");
        let imageData = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);

        retCtx.putImageData(this.applyImageData(imageData), 0, 0);

        return retCanvas;
    }

    applyImageData(imageData) {
        return imageData;
    }
    
    static get type() {
        return "none";
    }
}

export default Filter;