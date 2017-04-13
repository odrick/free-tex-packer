import React from 'react';
import ReactDOM from 'react-dom';

import I18 from './utils/I18';
import APP from './APP';
import MainLayout from './ui/MainLayout.jsx';

import Storage from './utils/Storage';
import {Observer, GLOBAL_EVENT} from './Observer';

import appInfo from '../../package.json';

let app = null;
let layout = null;

const STORAGE_LANGUAGE_KEY = "language";

function loadLocalization() {
    I18.supportedLanguages = appInfo.localizations.slice();
    I18.path = "static/localization";
    I18.init(Storage.load(STORAGE_LANGUAGE_KEY, false));

    app = new APP();

    I18.load(renderLayout);

    Observer.on(GLOBAL_EVENT.CHANGE_LANG, setLocale);
}

function renderLayout() {
    layout = ReactDOM.render(React.createElement(MainLayout), document.getElementById("root"));
}

function setLocale(locale) {
    if(!layout) return;
    
    I18.init(locale);
    I18.load(() => {
        Storage.save(STORAGE_LANGUAGE_KEY, I18.currentLocale);
        layout.forceUpdate()
    });
}

window.addEventListener("load", loadLocalization, false);