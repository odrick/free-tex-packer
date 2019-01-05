const {ipcRenderer} = require('electron');

import {GLOBAL_EVENT, Observer} from "../../Observer";
import I18 from '../../utils/I18';
import appInfo from '../../../../package.json';

import Project from 'platform/Project';

import PackProperties from '../../ui/PackProperties.jsx';
import ImagesList from "../../ui/ImagesList.jsx";

class Controller {
    static init() {
        ipcRenderer.on("change-locale", (e, payload) => {
            Observer.emit(GLOBAL_EVENT.CHANGE_LANG, payload.data);
        });

        ipcRenderer.on("show-about", (e, payload) => {
            Observer.emit(GLOBAL_EVENT.SHOW_ABOUT);
        });

        ipcRenderer.on("project-load", (e, payload) => {
            let path = "";
            if(payload) path = payload.data;
            
            Project.load(path);
        });
        
        ipcRenderer.on("project-save", (e, payload) => {
            Project.save();
        });

        ipcRenderer.on("project-save-as", (e, payload) => {
            Project.saveAs();
        });

        ipcRenderer.on("project-new", (e, payload) => {
            Project.create();
        });
        
        ipcRenderer.on("preferences-save", (e, payload) => {
            PackProperties.i.saveOptions(true);
        });

        ipcRenderer.on("quit", (e, payload) => {
            Controller.quit();
        });
        
        ipcRenderer.on("action-add-images", (e, payload) => {
            ImagesList.i.addImagesFs();
        });

        ipcRenderer.on("action-add-folder", (e, payload) => {
            ImagesList.i.addFolderFs();
        });

        ipcRenderer.on("action-delete", (e, payload) => {
            ImagesList.i.deleteSelectedImages();
        });

        ipcRenderer.on("action-select-all", (e, payload) => {
            ImagesList.i.selectAllImages();
        });

        ipcRenderer.on("action-clear", (e, payload) => {
            ImagesList.i.clear();
        });

        ipcRenderer.on("action-export", (e, payload) => {
            Observer.emit(GLOBAL_EVENT.START_EXPORT);
        });
        
        ipcRenderer.on("update-available", (e, payload) => {
            Observer.emit(GLOBAL_EVENT.UPDATE_AVAILABLE, payload);
        });
        
        ipcRenderer.on("download-progress", (e, payload) => {
            Observer.emit(GLOBAL_EVENT.DOWNLOAD_PROGRESS_CHANGED, payload);
        });
        
        Observer.on(GLOBAL_EVENT.INSTALL_UPDATE, function() {
            ipcRenderer.send('install-update');
        });

        ipcRenderer.send('update-app-info', appInfo);
        
        Controller.updateRecentProjects();
        
        setTimeout(Project.startObserv, 1000);
    }
    
    static updateProject(path="") {
        ipcRenderer.send('project-update', {path: path});
    }

    static updateProjectModified(val) {
        ipcRenderer.send('project-modified', {val: val});
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
    
    static quit() {
        Project.saveChanges(() => {
            ipcRenderer.send('quit');
        });
    }
}

export default Controller;