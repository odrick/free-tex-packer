import {Observer, GLOBAL_EVENT} from './Observer';
import PackProcessor from './PackProcessor';
import TextureRenderer from './utils/TextureRenderer';
import Downloader from './utils/Downloader';

import I18 from './utils/I18';

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
        let keys = Object.keys(this.images);
        
        if(keys.length > 0) {
            Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
            setTimeout(() => this.doPack(), 0);
        }
        else {
            this.doPack();
        }
    }
    
    doPack() {
        let res = PackProcessor.pack(this.images, this.packOptions);

        if(res.error) {
            Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, res.description);
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
            Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
        }
    }
    
    startExport() {
        if(!this.packResult || !this.packResult.length) {
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f("NO_IMAGES_ERROR"));
            return;
        }

        Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
        setTimeout(() => this.doExport(), 0);
    }

    doExport() {
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
        Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
    }
}

export default APP;