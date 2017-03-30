import ImagesLoader from './utils/ImagesLoader';
import TextureView from './utils/TextureView';
import MaxRectsBinPack from './packers/MaxRectsBin';

window.addEventListener("load", start, false);

function start() {
    let data = [];
    for(let i=1; i<=24; i++) {
        data.push(i + ".png");
    }

    let loader = new ImagesLoader("test_data");
    loader.load(data, null, pack);
}

function removeRect(rects, name) {
    for(let i=0; i<rects.length; i++) {
        if(rects[i].name == name) {
            rects.splice(i, 1);
            return;
        }
    }
}

function pack(images) {
    let rects = [];

    let padding = 2;

    let maxWidth = 0, maxHeight = 0;

    for(let key in images) {
        let img = images[key];

        maxWidth += img.width;
        maxHeight += img.height;

        rects.push({
            width: img.width + padding * 2,
            height: img.height + padding * 2,
            name: key,
            image: img
        })
    }

    let width=300, height=300;

    if(!width) width = maxWidth;
    if(!height) height = maxHeight;

    while(rects.length) {
        let packer = new MaxRectsBinPack(width, height, false);
        let result = packer.insert2(rects, MaxRectsBinPack.methods.BestShortSideFit);

        let tView = new TextureView();
        tView.show(result, padding);

        document.body.appendChild(tView.view);

        for(let item of result) {
            removeRect(rects, item.name);
        }
    }

}