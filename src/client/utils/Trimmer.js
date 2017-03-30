function trim(rects) {

    let cns = document.createElement("canvas");
    let ctx = cns.getContext("2d");

    for(let item of rects) {
        let img = item.image;

        cns.width = img.width;
        cns.height = img.height;

        ctx.clearRect(0, 0, img.width, img.height);

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

        
    }

}

export default trim;