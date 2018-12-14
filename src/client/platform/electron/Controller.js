const {ipcRenderer} = require('electron');

import {GLOBAL_EVENT, Observer} from "../../Observer";
import I18 from '../../utils/I18';
import appInfo from '../../../../package.json';

import Project from 'platform/Project';

class Controller {
    static init() {
        ipcRenderer.on("change-locale", (e, data) => {
            Observer.emit(GLOBAL_EVENT.CHANGE_LANG, data.locale);
        });

        ipcRenderer.on("show-about", (e, data) => {
            Observer.emit(GLOBAL_EVENT.SHOW_ABOUT);
        });

        ipcRenderer.on("project-load", (e, data) => {
            Project.load();
        });
        
        ipcRenderer.on("project-save", (e, data) => {
            Project.save();
        });
    }
    
    static updateLocale() {
        ipcRenderer.send('update-locale', {
            currentLocale: I18.currentLocale,
            strings: I18.strings,
            appInfo: appInfo,
            env: process.env.NODE_ENV
        });
    }
}

export default Controller;