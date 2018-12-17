import APP from '../../APP';
import PackProperties from '../../ui/PackProperties.jsx';
import ImagesList from '../../ui/ImagesList.jsx';
import FileSystem from 'platform/FileSystem';
import appInfo from '../../../../package.json';

class Project {
    static getData() {
        let keys = Object.keys(APP.i.images);
        let images = [];
        let folders = [];
        
        for(let key of keys) {
            let image = APP.i.images[key].fsPath;
            let folder = image.folder;
            
            if(folder) {
                if(folders.indexOf(folder) < 0) folders.push(folder);
            }
            else {
                images.push(image);
            }
        }
        
        let packOptions = Object.assign({}, APP.i.packOptions);
        packOptions.packer = APP.i.packOptions.packer.type;
        packOptions.exporter = APP.i.packOptions.exporter.type;
        
        let meta = {
            version: appInfo.version
        };
        
        return {
            meta: meta,
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
            PackProperties.i.setOptions(data.packOptions);
            
            let images;
            
            FileSystem.loadImages(data.images, res => {
                images = res;
                
                let cf = 0;
                
                let loadNextFolder = () => {
                    if(cf >= data.folders.length) {
                        ImagesList.i.setImages(images);
                        return;
                    }
                    
                    FileSystem.loadFolder(data.folders[cf], (res) => {
                        let keys = Object.keys(res);
                        for(let key of keys) {
                            images[key] = res[key];
                        }
                        cf++;
                        loadNextFolder();
                    });
                };

                loadNextFolder();
            });
        }
    }

    static create() {
        PackProperties.i.setOptions(PackProperties.i.loadOptions());
        ImagesList.i.setImages({});
    }
}

export default Project;