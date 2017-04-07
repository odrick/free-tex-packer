import React from 'react';

import I18 from '../utils/I18';

class OldBrowserBlocker extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let ok = true;
        
        //check local storage
        if(!window.localStorage) ok = false;
        
        //check file reader
        if(!window.FileReader) ok = false;
        
        //check canvas
        let canvas = document.createElement("canvas");
        if(!canvas.getContext) ok = false;
        
        //check ajax
        if(!window.XMLHttpRequest) ok = false;
        
        if(!ok) {
            return (
                <div ref="shader" className="old-browser-shader">
                    <div className="old-browser-content">
                        {I18.f("OLD_BROWSER_MESSAGE1")}
                        <br/><br/>
                        {I18.f("OLD_BROWSER_MESSAGE2")}
                        <br/><br/><br/>
                        
                        <a href="https://www.google.ru/chrome/browser/" target="_blank" title="Google Chrome">
                            <img src="static/images/browser/chrome.png"/>
                        </a>

                        <a href="https://www.mozilla.org/firefox/" target="_blank" title="Firefox">
                            <img src="static/images/browser/firefox.png"/>
                        </a>

                        <a href="https://www.opera.com/download" target="_blank" title="Google Chrome">
                            <img src="static/images/browser/opera.png"/>
                        </a>

                        <a href="https://www.microsoft.com/windows/microsoft-edge" target="_blank" title="Microsoft Edge">
                            <img src="static/images/browser/edge.png"/>
                        </a>
                        
                    </div>
                </div>
            );
        }
        else {
            return (<span> </span>);
        }
    }
}

export default OldBrowserBlocker;