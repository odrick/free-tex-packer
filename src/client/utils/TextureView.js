class TextureView {

    constructor() {
        this.view = document.createElement("canvas");
        this.view.style.border = "1px solid #000";
    }

    show(images, data, padding=0) {
        let ctx = this.view.getContext("2d");

        let width=0, height=0;

        for(let item of data) {
            if(item.x + item.width > width) {
                width = item.x + item.width;
            }
            if(item.y + item.height > height) {
                height = item.y + item.height;
            }
        }

        this.view.width = width;
        this.view.height = height;

        ctx.clearRect(0, 0, width, height);

        for(let item of data) {
            let img = images[item.name];

            if(item.rotated) {
                ctx.save();
                ctx.translate(item.x+item.width, item.y);
                ctx.rotate(Math.PI/2);
                ctx.drawImage(img, 0, 0, img.width, img.height, padding, padding, img.width, img.height);
                ctx.restore();
            }
            else {
                ctx.drawImage(img, 0, 0, img.width, img.height, item.x+padding, item.y+padding, img.width, img.height);
            }
        }
    }

}

export default TextureView;