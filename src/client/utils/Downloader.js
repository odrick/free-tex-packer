import JSZip from "../bin/jszip.min";
import saveSaver from "../bin/file_saver.js";

class Downloader {
    
    static run(files) {

        let zip = new JSZip();

        for(let file of files) {
            zip.file(file.name, file.content, {base64: !!file.base64});
        }

        zip.generateAsync({type:"blob"}).then((content) => {
            saveSaver(content, "textures.zip");
        });
    }
    
}

export default Downloader;