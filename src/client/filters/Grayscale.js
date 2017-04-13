import Filter from './Filter';

class Grayscale extends Filter {
    constructor() {
        super();
    }
    
    applyImageData(imageData) {
        for(let i=0; i<imageData.data.length; i+=4) {
            let v = 0.2126*imageData.data[i] + 0.7152*imageData.data[i+1] + 0.0722*imageData.data[i+2];
            imageData.data[i] = v;
            imageData.data[i + 1] = v;
            imageData.data[i + 2] = v;
        }
        
        return imageData;
    }

    static get type() {
        return "grayscale";
    }
}

export default Grayscale;