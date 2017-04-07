import {Observer, GLOBAL_EVENT} from './Observer';
import PackProcessor from './PackProcessor';
import TextureRenderer from './utils/TextureRenderer';
import Downloader from './utils/Downloader';

class APP {
    
    constructor() {
        
        this.images = {};
        this.packOptions = {};
        this.packResult = null;
        
        Observer.on(GLOBAL_EVENT.IMAGES_LIST_CHANGED, this.onImagesListChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_OPTIONS_CHANGED, this.onPackOptionsChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_EXPORTER_CHANGED, this.onPackExporterOptionsChanged, this);
        Observer.on(GLOBAL_EVENT.START_EXPORT, this.startExport, this);
    }
    
    onImagesListChanged(data) {
        this.images = data;
        this.pack();
    }
    
    onPackOptionsChanged(data) {
        this.packOptions = data;
        this.pack();
    }

    onPackExporterOptionsChanged(data) {
        this.packOptions = data;
    }
    
    pack() {
        //TODO: show ui shader
        
        let res = PackProcessor.pack(this.images, this.packOptions);

        if(res.error) {
            //TODO: ui dialog
            console.log(res);
        }
        else {
            this.packResult = [];

            for(let data of res) {
                let renderer = new TextureRenderer(data, this.packOptions);

                this.packResult.push({
                    data: data,
                    buffer: renderer.buffer
                });
            }
            
            Observer.emit(GLOBAL_EVENT.PACK_COMPLETE, this.packResult);
        }
    }
    
    startExport() {
        if(!this.packResult) {
            //TODO: ui dialog
            console.log("Nothing to export...");
            return;
        }

        //TODO: show ui shader
        
        let exporter = new this.packOptions.exporter();
        let textureName = this.packOptions.textureName;

        let files = [];
        
        let ix = 0;
        for(let item of this.packResult) {

            let fName = textureName + (this.packResult.length > 1 ? "-" + ix : "");

            let imageData = item.buffer.toDataURL();
            let parts = imageData.split(",");
            parts.shift();
            imageData = parts.join(",");

            files.push({
                name: fName + ".png",
                content: imageData,
                base64: true
            });

            let options = {
                imageName: fName + ".png",
                format: "RGBA8888",
                imageWidth: item.buffer.width,
                imageHeight: item.buffer.height,
                removeFileExtension: this.packOptions.removeFileExtension,
                scale: this.packOptions.scale
            };

            files.push({
                name: fName + "." + this.packOptions.exporter.fileExt,
                content: exporter.run(item.data, options)
            });
            
            ix++;
        }

        Downloader.run(files, this.packOptions.fileName);
    }
}

export default APP;