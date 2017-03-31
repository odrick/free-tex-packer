class Trimmer {

    constructor() {

    }

    static getAlpha(data, width, x, y) {
        return data[((y * (width * 4)) + (x * 4)) + 3];
    }

    static getLeftSpace(data, width, height) {
        let x = 0;

        for(x=0; x<width; x++) {
            for(let y=0; y<height; y++) {
                if(this.getAlpha(data, width, x, y)) {
                    return x;
                }
            }
        }

        return 0;
    }

    static getRightSpace(data, width, height) {
        let x = 0;

        for(x=width-1; x>=0; x--) {
            for(let y=0; y<height; y++) {
                if(this.getAlpha(data, width, x, y)) {
                    return width-x-1;
                }
            }
        }

        return 0;
    }

    static getTopSpace(data, width, height) {
        let y = 0;

        for(y=0; y<height; y++) {
            for(let x=0; x<width; x++) {
                if(this.getAlpha(data, width, x, y)) {
                    return y;
                }
            }
        }

        return 0;
    }

    static getBottomSpace(data, width, height) {
        let y = 0;

        for(y=height-1; y>=0; y--) {
            for(let x=0; x<width; x++) {
                if(this.getAlpha(data, width, x, y)) {
                    return height-y-1;
                }
            }
        }

        return 0;
    }

    static trim(rects) {

        let cns = document.createElement("canvas");
        let ctx = cns.getContext("2d");

        for(let item of rects) {

            let img = item.image;

            cns.width = img.width;
            cns.height = img.height;

            ctx.clearRect(0, 0, img.width, img.height);

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

            let data = ctx.getImageData(0, 0, img.width, img.height).data;

            let spaces = {left: 0, right: 0, top: 0, bottom: 0};

            spaces.left = this.getLeftSpace(data, img.width, img.height);
            if(spaces.left != img.width) {
                spaces.right = this.getRightSpace(data, img.width, img.height);
                spaces.top = this.getTopSpace(data, img.width, img.height);
                spaces.bottom = this.getBottomSpace(data, img.width, img.height);

                if(spaces.left > 0 || spaces.right > 0 || spaces.top > 0 || spaces.bottom > 0) {
                    item.trimmed = true;
                    item.spriteSourceSize.x = spaces.left;
                    item.spriteSourceSize.y = spaces.top;
                    item.spriteSourceSize.w = img.width-spaces.left-spaces.right;
                    item.spriteSourceSize.h = img.height-spaces.top-spaces.bottom;
                }
            }
            else {
                item.trimmed = true;
                item.spriteSourceSize.x = 0;
                item.spriteSourceSize.y = 0;
                item.spriteSourceSize.w = 1;
                item.spriteSourceSize.h = 1;
            }

            if(item.trimmed) {
                item.frame.w = item.spriteSourceSize.w;
                item.frame.h = item.spriteSourceSize.h;
            }
        }
    }
}

export default Trimmer;