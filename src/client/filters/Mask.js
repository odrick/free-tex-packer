import Filter from './Filter';

class Mask extends Filter {
    constructor() {
        super();
    }

    applyImageData(imageData) {
        for(let i=0; i<imageData.data.length; i+=4) {
            if(imageData.data[i+3] == 0) {
                imageData.data[i] = 0;
                imageData.data[i+1] = 0;
                imageData.data[i+2] = 0;
            }
            else {
                imageData.data[i] = 255;
                imageData.data[i+1] = 255;
                imageData.data[i+2] = 255;
            }
        }
        
        return imageData;
    }

    static get type() {
        return "mask";
    }
}

export default Mask;