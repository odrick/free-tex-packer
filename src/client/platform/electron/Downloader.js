const fs = require('fs');
const {dialog} = require('electron').remote;

class Downloader {

    static run(files, fileName, savePath) {
        
        let dir = savePath;
        
        if(!dir) {
            dir = dialog.showOpenDialog({
                properties: ['openDirectory']
            });
        }
        
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