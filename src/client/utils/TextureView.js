class TextureView {

    constructor(width=1, height=1) {
        this.view = document.createElement("canvas");

        this.width = width;
        this.height = height;

        this.view.width = width;
        this.view.height = height;

        this.view.style.border = "1px solid #000";
    }

    show(images, data) {
        let ctx = this.view.getContext("2d");

        ctx.clearRect(0, 0, this.width, this.height);

        for(let item of data) {
            let img = images[item.name];

            if(item.flipped) {
                ctx.save();
                ctx.translate(item.x+item.height, item.y);
                ctx.rotate(Math.PI/2);
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, item.width, item.height);
                ctx.restore();
            }
            else {
                ctx.drawImage(img, 0, 0, img.width, img.height, item.x, item.y, item.width, item.height);
            }
        }
    }

}

export default TextureView;