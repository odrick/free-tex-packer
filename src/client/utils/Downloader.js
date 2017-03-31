import JSZip from "../bin/jszip.min";
import saveAs from "../bin/file_saver.js";

class Downloader {
    
    static run(data) {

        let zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        //var img = zip.folder("images");
        //img.file("smile.gif", imgData, {base64: true});
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "example.zip");
            });
        
        /*
        for(item of data) {
            
        }
        */
        
    }
    
}

export default Downloader;