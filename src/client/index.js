import React from 'react';
import ReactDOM from 'react-dom';

import I18 from './utils/I18';
import APP from './APP';
import MainLayout from './ui/MainLayout.jsx';

import appInfo from '../../package.json';

let app = null;

function loadLocalization() {
    I18.supportedLanguages = appInfo.localizations.slice();
    I18.path = "static/localization";
    I18.init();
    I18.load(start);
}

function start() {
    app = new APP();
    ReactDOM.render(React.createElement(MainLayout), document.getElementById("main"));
}

window.addEventListener("load", loadLocalization, false);