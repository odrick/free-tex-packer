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

function pack(images) {
    let rects = [];

    for(let key in images) {
        let img = images[key];

        rects.push({
            width: img.width,
            height: img.height,
            name: key
        })
    }

    let width=300, height=300;

    let packer = new MaxRectsBinPack(width, height, true);
    let result = packer.insert2(rects, MaxRectsBinPack.methods.BestShortSideFit);

    console.log(result);

    let tView = new TextureView(width, height);
    tView.show(images, result);

    document.body.appendChild(tView.view);

}