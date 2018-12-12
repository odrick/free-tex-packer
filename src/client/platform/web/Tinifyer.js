import {POST} from "../../utils/ajax";
import I18 from "../../utils/I18";
import appInfo from '../../../../package.json';

class Tinifyer {
    static start(imageData, packOptions) {
        return new Promise((resolve, reject) => {
            if(packOptions.tinify) {
                POST(appInfo.tinifyUrl, {key: packOptions.tinifyKey, data: imageData}, (data) => {
                    data = JSON.parse(data);

                    if(data.data) {
                        resolve(data.data);
                    }
                    else {
                        if(data.error) {
                            reject(I18.f("TINIFY_ERROR", data.error));
                        }
                        else {
                            reject(I18.f("TINIFY_ERROR_COMMON"));
                        }
                    }
                }, () => {
                    reject(I18.f("TINIFY_ERROR_COMMON"));
                });
            }
            else {
                resolve(imageData);
            }
        });
    }
}

export default Tinifyer;