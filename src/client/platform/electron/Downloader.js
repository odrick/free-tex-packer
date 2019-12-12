const fs = require('fs');
const path = require('path');
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
            dir = String(dir);
            for(let file of files) {
                let content = file.content;
                if(file.base64) content = Buffer.from(content, 'base64');

                let savePath = path.normalize(dir + "/" + file.name);
                savePath = savePath.split("\\").join("/");
                
                let saveDirParts = savePath.split("/");
                saveDirParts.pop();
                let currentPath = '';
                while(saveDirParts.length) {
                    currentPath = currentPath + saveDirParts.shift() + '/';
                    if(!fs.existsSync(currentPath)) {
                        fs.mkdirSync(currentPath);
                    }
                }
                
                fs.writeFileSync(savePath, content);
            }
        }
    }

}

export default Downloader;