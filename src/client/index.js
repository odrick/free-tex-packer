import React from 'react';
import ReactDOM from 'react-dom';

import APP from './APP';
import MainLayout from './ui/MainLayout.jsx';

window.addEventListener("load", start, false);

let app = null;

function start() {
    app = new APP();
    ReactDOM.render(React.createElement(MainLayout), document.getElementById("main"));
}

/*

function showSprites() {
    if(currentResult) {
        let viewer = new SpriteViewer(currentResult);
        viewer.show();
    }
}
*/