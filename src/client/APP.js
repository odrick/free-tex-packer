import {Observer, GLOBAL_EVENT} from './Observer';
import PackProcessor from './PackProcessor';
import TextureRenderer from './utils/TextureRenderer';
import {getFilterByType} from './filters';
import I18 from './utils/I18';
import {startExporter} from './exporters';
import Tinifyer from 'platform/Tinifyer';
import Downloader from 'platform/Downloader';

let INSTANCE = null;

class APP {
    
    constructor() {
        INSTANCE = this;
        
        this.images = {};
        this.packOptions = {};
        this.packResult = null;
        
        this.onPackComplete = this.onPackComplete.bind(this);
        this.onPackError = this.onPackError.bind(this);
        
        Observer.on(GLOBAL_EVENT.IMAGES_LIST_CHANGED, this.onImagesListChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_OPTIONS_CHANGED, this.onPackOptionsChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_EXPORTER_CHANGED, this.onPackExporterOptionsChanged, this);
        Observer.on(GLOBAL_EVENT.START_EXPORT, this.startExport, this);
    }
    
    static get i() {
        return INSTANCE;
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
        PackProcessor.pack(this.images, this.packOptions, this.onPackComplete, this.onPackError);
    }
    
    onPackComplete(res) {
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
    
    onPackError(err) {
        Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
        Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, err.description);
    }
    
    startExport() {
        if(!this.packResult || !this.packResult.length) {
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f("NO_IMAGES_ERROR"));
            return;
        }

        if(this.packOptions.tinify && !this.packOptions.tinifyKey) {
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f("NO_TINIFY_KEY_ERROR"));
            return;
        }

        Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
        setTimeout(() => this.doExport(), 0);
    }

    async doExport() {
        let exporter = this.packOptions.exporter;
        let textureName = this.packOptions.textureName;
        let filterClass = getFilterByType(this.packOptions.filter);
        let filter = new filterClass();

        let files = [];

        let ix = 0;
        for(let item of this.packResult) {
            
            let fName = textureName + (this.packResult.length > 1 ? "-" + ix : "");
            
            let imageData = filter.apply(item.buffer).toDataURL(this.packOptions.textureFormat == "png" ? "image/png" : "image/jpeg");
            let parts = imageData.split(",");
            parts.shift();
            imageData = parts.join(",");

            try {
                imageData = await Tinifyer.start(imageData, this.packOptions);
            }
            catch(e) {
                Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
                Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, e);
                return;
            }

            files.push({
                name: `${fName}.${this.packOptions.textureFormat}`,
                content: imageData,
                base64: true
            });

            //TODO: move to options
            let pixelFormat = this.packOptions.textureFormat == "png" ? "RGBA8888" : "RGB888";

            let options = {
                imageName: `${fName}`,
                imageFile: `${fName}.${this.packOptions.textureFormat}`,
                imageData: imageData,
                format: pixelFormat,
                textureFormat: this.packOptions.textureFormat,
                imageWidth: item.buffer.width,
                imageHeight: item.buffer.height,
                removeFileExtension: this.packOptions.removeFileExtension,
                prependFolderName: this.packOptions.prependFolderName,
                base64Export: this.packOptions.base64Export,
                scale: this.packOptions.scale,
                allowTrim: this.packOptions.allowTrim,
                trimMode: this.packOptions.trimMode
            };

            try {
                files.push({
                    name: fName + "." + this.packOptions.exporter.fileExt,
                    content: await startExporter(exporter, item.data, options)
                });
            }
            catch(e) {
                Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
                Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f("EXPORTER_ERROR", e));
                return;
            }
            
            ix++;
        }

        Downloader.run(files, this.packOptions.fileName);
        Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
    }
}

export default APP;