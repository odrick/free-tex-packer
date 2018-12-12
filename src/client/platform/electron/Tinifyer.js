const {ipcRenderer} = require('electron');

import I18 from "../../utils/I18";

class Tinifyer {
    static start(imageData, packOptions) {
        return new Promise((resolve, reject) => {
            if(packOptions.tinify) {
                let uid = Date.now() + "_" + Math.random();
                let data = {imageData: imageData, key: packOptions.tinifyKey, uid: uid};
                
                let handler = (e, data) => {
                    if(data.uid === uid) {
                        ipcRenderer.removeListener('tinify-complete', handler);
                        
                        if(data.success) {
                            resolve(data.data);
                        }
                        else {
                            if(data.error) reject(I18.f("TINIFY_ERROR", data.error));
                            else reject(I18.f("TINIFY_ERROR_COMMON"));
                        }
                    }
                };
                
                ipcRenderer.on('tinify-complete', handler);
                ipcRenderer.send('tinify', data);
            }
            else {
                resolve(imageData);
            }
        });
    }
}

export default Tinifyer;