import {Observer, GLOBAL_EVENT} from './Observer';
import PackProcessor from './PackProcessor';
import TextureView from './utils/TextureView';

class APP {
    
    constructor() {
        
        this.images = {};
        this.packOptions = {};
        this.packResult = null;
        
        Observer.on(GLOBAL_EVENT.IMAGES_LIST_CHANGED, this.onImagesListChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_OPTIONS_CHANGED, this.onPackOptionsChanged, this);
        Observer.on(GLOBAL_EVENT.PACK_EXPORTER_CHANGED, this.onPackExporterOptionsChanged, this);
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
        if(!Object.keys(this.images).length) return;
        
        let res = PackProcessor.pack(this.images, this.packOptions);

        if(res.error) {
            //TODO: ui dialog
            console.log(res);
        }
        else {
            this.packResult = [];

            //TODO: move this to the other place
            let container = document.getElementById("resultContainer");
            container.innerHTML = "";

            for(let data of res) {
                let view = new TextureView();
                view.show(data, this.packOptions);
                container.appendChild(view.view);

                this.packResult.push({
                    data: data,
                    view: view
                });
            }
        }
    }
}

export default APP;