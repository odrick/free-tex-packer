const fs = require('fs');
const {dialog} = require('electron').remote;

import I18 from '../../utils/I18';
import Base64ImagesLoader from '../../utils/Base64ImagesLoader';

const IMAGES_EXT = ['jpg', 'png', 'gif'];

class FileSystem {
    static fixPath(path) {
        return path.split("\\").join("/");
    }
    
    static getExtFromPath(path) {
        return path.split(".").pop().toLowerCase();
    }
    
    static getFolderFilesList(dir, base="", list=[]) {
        let files = fs.readdirSync(dir);
        for(let file of files) {
            if (fs.statSync(dir + file).isDirectory()) {
                list = FileSystem.getFolderFilesList(dir + file + '/', base + file + "/", list);
            }
            else {
                list.push({
                    name: (base ? base : "") + file,
                    path: dir + file
                });
            }
        }

        return list;
    }
    
    static addImages(cb) {
        let list = dialog.showOpenDialog({
            filters: [{name: I18.f("IMAGES"), extensions: IMAGES_EXT}],
            properties: ['openFile', 'multiSelections']
        });
        
        if(list) {
            let files = [];
            for(let path of list) {
                path = FileSystem.fixPath(path);
                let name = path.split("/").pop();

                files.push({
                    name: name,
                    path: path
                });
            }

            FileSystem.loadImages(files, cb);
        }
        else {
            if(cb) cb();
        }
    }

    static addFolder(cb) {
        let dir = dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        if(dir && dir.length) {
            let path = FileSystem.fixPath(dir[0]);
            
            let parts = path.split("/");
            let name = "";
            while(parts.length && !name) name = parts.pop();
            
            let list = FileSystem.getFolderFilesList(path + "/", name + "/");
            FileSystem.loadImages(list, cb);
        }
        else {
            if(cb) cb();
        }
    }

    static loadImages(list, cb) {
        let files = [];

        for(let item of list) {
            let path = item.path;
            let ext = FileSystem.getExtFromPath(path);
            
            if(IMAGES_EXT.indexOf(ext) >= 0) {
                let content = fs.readFileSync(path, 'base64');
                content = "data:image/" + ext + ";base64," + content;

                files.push({name: item.name, url: content, fsPath: item});
            }
        }

        let loader = new Base64ImagesLoader();
        loader.load(files, null, (res) => {
            if(cb) cb(res);
        });
    }
}

export default FileSystem;