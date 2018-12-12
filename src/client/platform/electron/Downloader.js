const fs = require('fs');
const {dialog} = require('electron').remote;

class Downloader {

    static run(files, fileName) {

        /*
        let zip = new JSZip();

        for(let file of files) {
            zip.file(file.name, file.content, {base64: !!file.base64});
        }

        let ext = fileName.split(".").pop();
        if(ext !== "zip") fileName = fileName + ".zip";

        zip.generateAsync({type:"blob"}).then((content) => {
            FileSaver.saveAs(content, fileName);
        });
        */

        let dir = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        
        if(dir) {
            for(let file of files) {
                let content = file.content;
                if(file.base64) content = Buffer.from(content, 'base64');
                
                fs.writeFileSync(dir + "/" + file.name, content);
            }
        }
    }

}

export default Downloader;