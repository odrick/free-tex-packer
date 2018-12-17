const fs = require('fs');
const {dialog} = require('electron').remote;

import Controller from 'platform/Controller';
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
            if (fs.statSync(dir + file).isDirectory() && (dir + file).toUpperCase().indexOf("__MACOSX") < 0) {
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
                    path: path,
                    folder: ""
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
            FileSystem.loadFolder(path, cb);
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
                try {
                    let content = fs.readFileSync(path, 'base64');
                    content = "data:image/" + ext + ";base64," + content;
                    files.push({name: item.name, url: content, fsPath: item});
                }
                catch(e){}
            }
        }

        let loader = new Base64ImagesLoader();
        loader.load(files, null, (res) => {
            if(cb) cb(res);
        });
    }
    
    static loadFolder(path, cb) {
        if(fs.existsSync(path)) {
            let parts = path.split("/");
            let name = "";
            while (parts.length && !name) name = parts.pop();

            let list = FileSystem.getFolderFilesList(path + "/", name + "/");

            for (let item of list) {
                item.folder = path;
            }

            FileSystem.loadImages(list, cb);
        }
        else {
            cb({});
        }
    }
    
    static saveProject(data, path="") {
        let options = {
            filters: [{name: "Free texture packer", extensions: ['ftpp']}]
        };
        if(path) options.defaultPath = path;

        let savePath = dialog.showSaveDialog(options);
        
        if(savePath) {
            savePath = FileSystem.fixPath(savePath);
            fs.writeFileSync(savePath, JSON.stringify(data, null, 2));
        }
    }
    
    static loadProject() {
        let path = dialog.showOpenDialog({
            filters: [{name: "Free texture packer", extensions: ['ftpp']}],
            properties: ['openFile']
        });

        let data = null;
        
        if(path && path[0]) {
            path = FileSystem.fixPath(path[0]);
            data = fs.readFileSync(path);
            try {
                data = JSON.parse(data);
                Controller.onProjectLoaded(path);
            }
            catch(e) {data = null}
        }
        
        return data;
    }
}

export default FileSystem;