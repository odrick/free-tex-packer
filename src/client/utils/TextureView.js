class TextureView {

    constructor() {
        this.view = document.createElement("canvas");
        this.view.style.border = "1px solid #000";

        this.width = 0;
        this.height = 0;
    }

    show(data, options={}) {
        let ctx = this.view.getContext("2d");

        let width = options.width || 0;
        let height = options.height || 0;
        let padding = options.padding || 0;

        if(!options.fixedSize) {
            width = 0;
            height = 0;

            for (let item of data) {

                let w = item.frame.x + item.frame.w;
                let h = item.frame.y + item.frame.h;

                if(item.rotated) {
                    w = item.frame.x + item.frame.h;
                    h = item.frame.y + item.frame.w;
                }


                if (w > width) {
                    width = w;
                }
                if (h > height) {
                    height = h;
                }
            }

            width += padding;
            height += padding;

        }

        this.width = width;
        this.height = height;
        this.view.width = width;
        this.view.height = height;

        ctx.clearRect(0, 0, width, height);

        for(let item of data) {
            let img = item.image;

            if(item.rotated) {
                ctx.save();
                ctx.translate(item.frame.x + item.frame.h, item.frame.y);

                ctx.rotate(Math.PI/2);
                ctx.drawImage(img,
                              item.spriteSourceSize.x,
                              item.spriteSourceSize.y,
                              item.spriteSourceSize.w,
                              item.spriteSourceSize.h,
                              0, 0,
                              item.frame.w, item.frame.h);
                ctx.restore();
            }
            else {
                ctx.drawImage(img,
                              item.spriteSourceSize.x,
                              item.spriteSourceSize.y,
                              item.spriteSourceSize.w,
                              item.spriteSourceSize.h,
                              item.frame.x, item.frame.y,
                              item.frame.w, item.frame.h);
            }
        }
    }

}

export default TextureView;