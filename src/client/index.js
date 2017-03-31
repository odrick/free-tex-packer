import ImagesLoader from './utils/ImagesLoader';
import PackProcessor from './PackProcessor';
import packers from './packers';
import exporters from './exporters';
import TextureView from './utils/TextureView';
import SpriteViewer from './utils/SpriteViewer';

window.addEventListener("load", start, false);

let images = null;
let currentResult = null;

function start() {
    document.getElementById("start").addEventListener("click", pack, false);
    document.getElementById("export").addEventListener("click", doExport, false);
    document.getElementById("showSprites").addEventListener("click", showSprites, false);

    let packerSelect = document.getElementById("packer");
    packerSelect.innerHTML = "";
    packerSelect.addEventListener("change", showPackerMethods, false);

    for(let packer of packers) {
        let option = document.createElement("option");
        option.value = packer.type;
        option.innerHTML = packer.type;
        packerSelect.appendChild(option);
    }

    showPackerMethods(packerSelect.value);

    let exporterSelect = document.getElementById("exporter");
    for(let exporter of exporters) {
        let option = document.createElement("option");
        option.value = exporter.type;
        option.innerHTML = exporter.type;
        exporterSelect.appendChild(option);
    }

    document.getElementById("addImages").addEventListener("change", loadImages, false);

    /*
    let data = [];
    for(let i=1; i<=24; i++) {
        data.push(i + ".png");
    }

    let loader = new ImagesLoader("test_data");
    loader.load(data, null, preloadComplete);
    */
}

function loadImages(e) {
    let loader = new ImagesLoader();
    loader.load(e.target.files, null, loadImagesComplete);
}

function loadImagesComplete(data) {
    document.getElementById("addImages").value = "";
    
    images = data;
    pack();
}

function showPackerMethods(type) {
    let methodSelect = document.getElementById("packerMethod");
    methodSelect.innerHTML = "";

    for(let packer of packers) {
        if(packer.type == type) {
            for(let method in packer.methods) {
                let option = document.createElement("option");
                option.value = method;
                option.innerHTML = method;
                methodSelect.appendChild(option);
            }

            return;
        }
    }
}

function pack() {
    if(!images) return;
    
    let options = {
        width: Number(document.getElementById("width").value),
        height: Number(document.getElementById("width").value),
        fixedSize: document.getElementById("fixedSize").checked,
        padding: Number(document.getElementById("padding").value),
        allowRotation: document.getElementById("allowRotation").checked,
        allowTrim: document.getElementById("allowTrim").checked,
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

            let ix = 0;
            for(let item of currentResult) {

                let options = {
                    imageName: "texture_" + ix + ".png",
                    format: "RGBA8888",
                    imageWidth: item.view.width,
                    imageHeight: item.view.height,
                    scale: 1
                };

                console.log(exporter.run(item.data, options));

                ix++;
            }
        }
    }
}

function showSprites() {
    if(currentResult) {
        let viewer = new SpriteViewer(currentResult);
        viewer.show();
    }
}