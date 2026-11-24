// TinyPNG compression is available in the desktop (electron) version only.
class Tinifyer {
    static start(imageData, packOptions) {
        return Promise.resolve(imageData);
    }
}

export default Tinifyer;
