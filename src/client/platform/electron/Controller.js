const {ipcRenderer} = require('electron');

import {GLOBAL_EVENT, Observer} from "../../Observer";
import I18 from '../../utils/I18';
import appInfo from '../../../../package.json';

import Project from 'platform/Project';

import PackProperties from '../../ui/PackProperties.jsx';

class Controller {
    static init() {
        ipcRenderer.on("change-locale", (e, data) => {
            Observer.emit(GLOBAL_EVENT.CHANGE_LANG, data.locale);
        });

        ipcRenderer.on("show-about", (e, data) => {
            Observer.emit(GLOBAL_EVENT.SHOW_ABOUT);
        });

        ipcRenderer.on("project-load", (e, data) => {
            let path = "";
            if(data) path = data.path;
            
            Project.load(path);
        });
        
        ipcRenderer.on("project-save", (e, data) => {
            Project.save();
        });

        ipcRenderer.on("project-new", (e, data) => {
            Project.create();
        });
        
        ipcRenderer.on("preferences-save", (e, data) => {
            PackProperties.i.saveOptions(true);
        });

        ipcRenderer.send('update-app-info', appInfo);
        
        Controller.updateRecentProjects();
    }
    
    static onProjectLoaded(path) {
        ipcRenderer.send('project-loaded', {path: path});
    }
    
    static updateRecentProjects() {
        ipcRenderer.send('project-recent-update', {projects: Project.getRecentProjects()});
    }
    
    static updateLocale() {
        ipcRenderer.send('update-locale', {
            currentLocale: I18.currentLocale,
            strings: I18.strings
        });
    }
}

export default Controller;