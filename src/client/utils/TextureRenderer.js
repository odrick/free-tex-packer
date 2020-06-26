class TextureRenderer {
    
    constructor(data, options={}) {
        this.buffer = document.createElement("canvas");

        this.width = 0;
        this.height = 0;
        
        this.render(data, options);
    }
    
    static getSize(data, options={}) {
        let width = options.width || 0;
        let height = options.height || 0;

        let padding = options.padding || 0;
        let extrude = options.extrude || 0;

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

            width += padding + extrude;
            height += padding + extrude;
        }

        if (options.powerOfTwo) {
            let sw = Math.round(Math.log(width)/Math.log(2));
            let sh = Math.round(Math.log(height)/Math.log(2));

            let pw = Math.pow(2, sw);
            let ph = Math.pow(2, sh);

            if(pw < width) pw = Math.pow(2, sw + 1);
            if(ph < height) ph = Math.pow(2, sh + 1);

            width = pw;
            height = ph;
        }
        
        return {width, height};
    }
    
    render(data, options={}) {
        let ctx = this.buffer.getContext("2d");

        let { width, height } = TextureRenderer.getSize(data, options);

        this.width = width;
        this.height = height;
        this.buffer.width = width;
        this.buffer.height = height;

        ctx.clearRect(0, 0, width, height);

        for(let item of data) {
            this.renderItem(ctx, item, options);
        }

    }
    
    scale(val) {
        if(val === 1) return this.buffer;
        
        let tempBuffer = document.createElement("canvas");
        tempBuffer.width = Math.round(this.buffer.width * val) || 1;
        tempBuffer.height = Math.round(this.buffer.height * val) || 1;

        let tempCtx = tempBuffer.getContext("2d");
        tempCtx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, 0, 0, tempBuffer.width, tempBuffer.height);

        return tempBuffer;
    }
    
    renderExtrude(ctx, item, options) {
        if(!options.extrude) return;
        
        let dx = item.frame.x;
        let dy = item.frame.y;
        
        if(item.rotated) {
            dx = 0;
            dy = 0;
        }

        let img = item.image;
        
        //Draw corners
        ctx.drawImage(img,
            0, 0,
            1, 1,
            dx - options.extrude, dy - options.extrude,
            options.extrude, options.extrude);

        ctx.drawImage(img,
            0, item.sourceSize.h-1,
            1, 1,
            dx - options.extrude, dy + item.frame.h,
            options.extrude, options.extrude);

        ctx.drawImage(img,
            item.sourceSize.w-1, 0,
            1, 1,
            dx + item.frame.w, dy - options.extrude,
            options.extrude, options.extrude);

        ctx.drawImage(img,
            item.sourceSize.w-1, item.sourceSize.h-1,
            1, 1,
            dx + item.frame.w, dy + item.frame.h,
            options.extrude, options.extrude);
        
        //Draw borders
        ctx.drawImage(img,
            0, item.spriteSourceSize.y,
            1, item.spriteSourceSize.h,
            dx - options.extrude, dy,
            options.extrude, item.frame.h);

        ctx.drawImage(img,
            item.sourceSize.w - 1, item.spriteSourceSize.y,
            1, item.spriteSourceSize.h,
            dx + item.frame.w, dy,
            options.extrude, item.frame.h);

        ctx.drawImage(img,
            item.spriteSourceSize.x, 0,
            item.spriteSourceSize.w, 1,
            dx, dy - options.extrude,
            item.frame.w, options.extrude);

        ctx.drawImage(img,
            item.spriteSourceSize.x, item.sourceSize.h - 1,
            item.spriteSourceSize.w, 1,
            dx, dy + item.frame.h,
            item.frame.w, options.extrude);

    }
    
    renderItem(ctx, item, options) {
        if(!item.skipRender) {

            let img = item.image;

            if (item.rotated) {
                ctx.save();
                ctx.translate(item.frame.x + item.frame.h, item.frame.y);

                ctx.rotate(Math.PI / 2);

                this.renderExtrude(ctx, item, options);
                
                ctx.drawImage(img,
                              item.spriteSourceSize.x, item.spriteSourceSize.y,
                              item.spriteSourceSize.w, item.spriteSourceSize.h,
                              0, 0,
                              item.frame.w, item.frame.h);
                
                ctx.restore();
            }
            else {
                this.renderExtrude(ctx, item, options);
                
                ctx.drawImage(img,
                              item.spriteSourceSize.x, item.spriteSourceSize.y,
                              item.spriteSourceSize.w, item.spriteSourceSize.h,
                              item.frame.x, item.frame.y,
                              item.frame.w, item.frame.h);
            }
        }
    }
}

export default TextureRenderer;
