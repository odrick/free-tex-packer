import React from 'react';
import ReactDOM from 'react-dom';

import I18 from './utils/I18';
import APP from './APP';
import MainLayout from './ui/MainLayout.jsx';

import Storage from './utils/Storage';
import {Observer, GLOBAL_EVENT} from './Observer';

import languages from './resources/static/localization/languages.json';

import Controller from 'platform/Controller';

let app = null;
let layout = null;

const STORAGE_LANGUAGE_KEY = "language";

function run() {
    Controller.init();
    if(PLATFORM === "electron") {
        injectCss("static/css/index-electron.css");
    }
    loadLocalization();
}

function loadLocalization() {
    for(let i = 1; i < languages.length; i++) {
        I18.supportedLanguages.push(languages[i].lang);
    }
    I18.path = "static/localization";
    I18.init(Storage.load(STORAGE_LANGUAGE_KEY, false));

    app = new APP();

    I18.load(renderLayout);

    Observer.on(GLOBAL_EVENT.CHANGE_LANG, setLocale);
}

function renderLayout() {
    Controller.updateLocale();
    layout = ReactDOM.render(React.createElement(MainLayout), document.getElementById("root"));
}

function injectCss(path) {
    let el = document.createElement("link");
    el.rel = "stylesheet";
    el.type = "text/css";
    el.href = path;
    document.head.appendChild(el);
}

function setLocale(locale) {
    if(!layout) return;
    
    I18.init(locale);
    I18.load(() => {
        Storage.save(STORAGE_LANGUAGE_KEY, I18.currentLocale);
        Controller.updateLocale();
        layout.forceUpdate();
    });
}

window.addEventListener("load", run, false);