import JSZip from 'jszip';
import FileSaver from 'file-saver';

class Downloader {

    static run(files, fileName) {

        let zip = new JSZip();

        for(let file of files) {
            zip.file(file.name, file.content, {base64: !!file.base64});
        }

        let ext = fileName.split(".").pop();
        if(ext !== "zip") fileName = fileName + ".zip";

        zip.generateAsync({type:"blob"}).then((content) => {
            FileSaver.saveAs(content, fileName);
        });
    }

}

export default Downloader;