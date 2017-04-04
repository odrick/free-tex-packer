import React from 'react';

class TempLayout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div>
                    load images: <input type="file" multiple id="addImages" accept="image/*" />
                    <br/>
                    load zip: <input type="file" multiple id="addZip" accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" />
                </div>
                <div>
                    width: <input type="number" id="width" value="300" min="0"/>
                    height: <input type="number" id="height" value="300" min="0"/>
                    fixedSize: <input type="checkbox" value="1" id="fixedSize"/>
                    <br/>
                    padding: <input type="number" id="padding" value="0" min="0"/>
                    <br/>
                    allowRotation: <input type="checkbox" value="1" id="allowRotation" checked="checked" />
                    allowTrim: <input type="checkbox" value="1" id="allowTrim" checked="checked" />
                    detectIdentical: <input type="checkbox" value="1" id="detectIdentical"checked="checked" />
                    <br/>
                    packer: <select id="packer"></select>
                    packerMethod: <select id="packerMethod"></select>
                    <br/>
                    <button id="start">START</button>
                </div>

                <div>
                    <br/><br/>
                    file name: <input type="text" value="texture" id="fileName" />
                    exporter: <select id="exporter"></select>
                    <br/>
                    <button id="export">EXPORT</button>
                </div>

                <div>
                    <br/><br/>
                    <button id="showSprites">SHOW SPRITES</button>
                </div>

                <hr/>

                <div id="result"></div>
            </div>
        );
    }
}

export default TempLayout;