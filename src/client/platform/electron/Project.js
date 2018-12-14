import APP from '../../APP';
import FileSystem from 'platform/FileSystem';

class Project {
    static getData() {
        let keys = Object.keys(APP.i.images);
        let images = [];
        let folders = [];
        
        for(let key of keys) {
            let image = APP.i.images[key].fsPath;
            images.push(image);
            
            let folder = image.folder;
            if(folder && folders.indexOf(folder) < 0) folders.push(folder);
        }
        
        let packOptions = Object.assign({}, APP.i.packOptions);
        packOptions.packer = APP.i.packOptions.packer.type;
        packOptions.exporter = APP.i.packOptions.exporter.type;
        
        return {
            images: images,
            folders: folders,
            packOptions: packOptions
        }
    }
    
    static save() {
        FileSystem.saveProject(Project.getData());
    }
    
    static load() {
        let data = FileSystem.loadProject();
        
        if(data) {
            
        }
    }
}

export default Project;