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
function pack() {
    if(!images) return;
    
    let options = {
        width: Number(document.getElementById("width").value),
        height: Number(document.getElementById("width").value),
        fixedSize: document.getElementById("fixedSize").checked,
        padding: Number(document.getElementById("padding").value),
        allowRotation: document.getElementById("allowRotation").checked,
        allowTrim: document.getElementById("allowTrim").checked,
        detectIdentical: document.getElementById("detectIdentical").checked,
        packer: null,
        packerMethod: document.getElementById("packerMethod").value
    };

    let packerType = document.getElementById("packer").value;
    for(let packer of packers) {
        if(packer.type == packerType) {
            options.packer = packer.cls;
            break;
        }
    }

    let res = PackProcessor.pack(images, options);

    if(res.error) {
        console.log(res);
    }
    else {
        currentResult = [];

        let container = document.getElementById("result");
        container.innerHTML = "";

        for(let data of res) {
            let view = new TextureView();
            view.show(data, options);
            container.appendChild(view.view);

            currentResult.push({
                data: data,
                view: view
            });
        }
    }
}

function doExport() {
    if(currentResult) {
        let exporterType = document.getElementById("exporter").value;
        let exporterClass = null;

        for(let item of exporters) {
            if(exporterType == item.type) {
                exporterClass = item;
                break;
            }
        }

        if(exporterClass) {
            let exporter = new exporterClass();

            let fileName = document.getElementById("fileName").value || "texture";

            let files = [];

            let ix = 0;
            for(let item of currentResult) {

                let fName = fileName + (currentResult.length > 1 ? "-" + ix : "");

                let imageData = item.view.view.toDataURL();
                let parts = imageData.split(",");
                parts.shift();
                imageData = parts.join(",");

                files.push({
                    name: fName + ".png",
                    content: imageData,
                    base64: true
                });

                let options = {
                    imageName: fName + ".png",
                    format: "RGBA8888",
                    imageWidth: item.view.width,
                    imageHeight: item.view.height,
                    removeFileExtension: true,
                    scale: 1
                };

                files.push({
                    name: fName + "." + exporterClass.fileExt,
                    content: exporter.run(item.data, options)
                });

                ix++;
            }

            Downloader.run(files);
        }
    }
}

function showSprites() {
    if(currentResult) {
        let viewer = new SpriteViewer(currentResult);
        viewer.show();
    }
}
*/