const fs = require('fs');
const {dialog} = require('electron').remote;

import I18 from '../../utils/I18';
import Base64ImagesLoader from '../../utils/Base64ImagesLoader';

class FileSystem {
    static addImages(cb) {
        let list = dialog.showOpenDialog({
            filters: [{name: I18.f("IMAGES"), extensions: ['jpg', 'png', 'gif']}],
            properties: ['openFile', 'multiSelections']
        });
        
        if(list) {
            
            let files = [];
            
            for(let path of list) {
                path = path.split("\\").join("/");
                
                let ext = path.split(".").pop().toLowerCase();
                let name = path.split("/").pop();
                
                let content = fs.readFileSync(path, 'base64');
                content = "data:image/" + ext + ";base64," + content;
                
                files.push({name: name, url: content});
            }
            
            let loader = new Base64ImagesLoader();
            loader.load(files, null, (res) => {
                if(cb) cb(res);
            })
        }
        else {
            if(cb) cb();
        }
    }
}

export default FileSystem;