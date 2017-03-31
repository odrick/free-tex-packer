import ImagesLoader from './utils/ImagesLoader';
import PackProcessor from './PackProcessor';
import packers from './packers';
import TextureView from './utils/TextureView';

window.addEventListener("load", start, false);

let images = [];

function start() {
    document.getElementById("start").addEventListener("click", pack, false);

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

    let data = [];
    for(let i=1; i<=24; i++) {
        data.push(i + ".png");
    }

    let loader = new ImagesLoader("test_data");
    loader.load(data, null, preloadComplete);
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

function preloadComplete(data) {
    console.log("LOADED");
    images = data;
}

function pack() {
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
        let container = document.getElementById("result");
        container.innerHTML = "";

        for(let data of res) {
            let view = new TextureView();
            view.show(data, options);
            container.appendChild(view.view);
        }
    }
}