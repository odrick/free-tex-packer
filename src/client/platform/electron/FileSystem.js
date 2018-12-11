const fs = require('fs');
const {dialog} = require('electron').remote;

import I18 from '../../utils/I18';
import Base64ImagesLoader from '../../utils/Base64ImagesLoader';

function getFolderFilesList(dir, base="", list=[]) {
    let files = fs.readdirSync(dir);
    for(let file of files) {
        if (fs.statSync(dir + file).isDirectory()) {
            list = getFolderFilesList(dir + file + '/', base + file + "/", list);
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

function fixPath(path) {
    return path.split("\\").join("/");
}

class FileSystem {
    static addImages(cb) {
        let list = dialog.showOpenDialog({
            filters: [{name: I18.f("IMAGES"), extensions: ['jpg', 'png', 'gif']}],
            properties: ['openFile', 'multiSelections']
        });
        
        if(list) {
            let files = [];
            for(let path of list) {
                path = fixPath(path);
                let name = path.split("/").pop();

                files.push({
                    name: name,
                    path: path
                });
            }

            FileSystem.loadFiles(files, cb);
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
            let path = fixPath(dir[0]);
            let name = path.split("/").pop();

            let list = getFolderFilesList(path + "/");
            FileSystem.loadFiles(list, cb);
        }
        else {
            if(cb) cb();
        }
    }

    static loadFiles(list, cb) {
        let files = [];

        for(let item of list) {
            let path = item.path;
            let ext = path.split(".").pop().toLowerCase();

            let content = fs.readFileSync(path, 'base64');
            content = "data:image/" + ext + ";base64," + content;

            files.push({name: item.name, url: content, fsPath: item});
        }

        let loader = new Base64ImagesLoader();
        loader.load(files, null, (res) => {
            if(cb) cb(res);
        });
    }
}

export default FileSystem;