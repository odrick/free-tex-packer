class TextureRenderer {
    
    constructor(data, options={}) {
        this.buffer = document.createElement("canvas");

        this.width = 0;
        this.height = 0;
        
        this.render(data, options);
    }
    
    render(data, options={}) {
        let ctx = this.buffer.getContext("2d");

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
        this.buffer.width = width;
        this.buffer.height = height;

        ctx.clearRect(0, 0, width, height);

        for(let item of data) {
            this.renderItem(ctx, item);
        }
    }
    
    renderItem(ctx, item) {
        if(!item.skipRender) {

            let img = item.image;

            if (item.rotated) {
                ctx.save();
                ctx.translate(item.frame.x + item.frame.h, item.frame.y);

                ctx.rotate(Math.PI / 2);
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

export default TextureRenderer;