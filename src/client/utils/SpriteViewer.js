class SpriteViewer {

    constructor(data) {

        this.createDOM();
        
        this.data = data;

        this.textures = [];
        
        this.sprite = new Sprite();

        this.width = 0;
        this.height = 0;

        for(let part of data) {
            let baseTexture = part.view.view;

            for(let config of part.data) {
                
                if(this.width < config.sourceSize.w) this.width = config.sourceSize.w;
                if(this.height < config.sourceSize.h) this.height = config.sourceSize.h;

                this.textures.push({
                    config: config,
                    baseTexture: baseTexture
                });
            }
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.update = this.update.bind(this);
        
        this.updateTimer = null;
        
        this.update();
    }
    
    createDOM() {
        this.container = document.createElement("div");
        this.container.align = "center";
        this.container.style.background = "#ccc";

        let text = document.createElement("span");
        text.innerHTML = "name pattern:";
        this.container.appendChild(text);

        this.patternInput = document.createElement("input");
        this.patternInput.value = "";
        this.patternInput.focus();
        this.container.appendChild(this.patternInput);
        
        let btn = document.createElement("button");
        btn.innerHTML = "GO";
        btn.addEventListener("click", () => this.updateSprite(), false);
        this.container.appendChild(btn);
        
        this.container.appendChild(document.createElement("br"));

        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);

        this.buffer = document.createElement("canvas");
        this.buffer.width = 1000;
        this.buffer.height = 1000;
        this.buffer.style.visibility = "hidden";
        this.buffer.style.width = "1px";
        this.buffer.style.height = "1px";
        this.container.appendChild(this.buffer);
        
        this.container.appendChild(document.createElement("br"));

        text = document.createElement("span");
        text.innerHTML = "speed:";
        this.container.appendChild(text);

        this.speed = document.createElement("input");
        this.speed.type = "range";
        this.speed.min = 1;
        this.speed.max = 60;
        this.speed.value = 24;
        this.container.appendChild(this.speed);

        this.container.appendChild(document.createElement("br"));
        
        btn = document.createElement("button");
        btn.innerHTML = "CLOSE";
        btn.addEventListener("click", () => this.close(), false);
        this.container.appendChild(btn);
    }

    updateSprite() {
        let textures = [];
        let pattern = this.patternInput.value;
        
        for(let tex of this.textures) {
            if(pattern.length > 0) {
                if(tex.config.name.substr(0, pattern.length) == pattern) {
                    textures.push(tex);
                }
            }
            else {
                textures.push(tex);
            }
        }
        
        textures = textures.sort((a, b) => {
            if(a.config.ix > b.config.ix) return 1;
            if(a.config.ix < b.config.ix) return -1;
            return 0;
        });

        this.sprite.textures = textures;
        this.sprite.gotoFrame(0);
        this.update(true);
    }
    
    update(skipSpriteUpdate) {
        clearInterval(this.updateTimer);
        
        if(!skipSpriteUpdate) this.sprite.update();
        this.render();

        this.updateTimer = setTimeout(this.update, 1000 / this.speed.value);
    }
    
    render() {
        this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
        this.sprite.render(this.canvas, this.buffer, this.width/2, this.height/2);
    }

    show(container=document.body) {
        this.container.style.position = "absolute";
        this.container.style.left = "0px";
        this.container.style.top = "0px";
        container.appendChild(this.container);
    }

    close() {
        clearInterval(this.updateTimer);
        
        if(this.container.parentNode) this.container.parentNode.removeChild(this.container);
        else if(this.container.parentElement) this.container.parentElement.removeChild(this.container);
        else {
        }
    }

}

class Sprite {
    
    constructor() {
        this.currentFrame = 0;
        this.textures = [];
    }
    
    gotoFrame(ix) {
        if(!this.textures.length) {
            this.currentFrame = 0;
            return;
        }
        
        this.currentFrame = Math.floor(ix);
        if(this.currentFrame < 0 || this.currentFrame > this.textures.length) {
            this.currentFrame = this.textures.length-1;
        }
    }
    
    update() {
        this.currentFrame++;
        if(this.currentFrame >= this.textures.length) {
            this.currentFrame = 0;
        }
    }
    
    render(cns, buffer, x, y) {
      
        let texture = this.textures[this.currentFrame];
        if(!texture) return;
        
        let bufferCtx = buffer.getContext("2d");
        bufferCtx.clearRect(0, 0, texture.config.sourceSize.w, texture.config.sourceSize.h);
        
        if(texture.config.rotated) {
            bufferCtx.save();

            bufferCtx.translate(texture.config.spriteSourceSize.x + texture.config.spriteSourceSize.w/2, texture.config.spriteSourceSize.y + texture.config.spriteSourceSize.h/2);
            bufferCtx.rotate(-Math.PI/2);

            bufferCtx.drawImage(texture.baseTexture,
                texture.config.frame.x, texture.config.frame.y,
                texture.config.frame.h, texture.config.frame.w,
                -texture.config.spriteSourceSize.h/2, -texture.config.spriteSourceSize.w/2,
                texture.config.spriteSourceSize.h, texture.config.spriteSourceSize.w);
            
            bufferCtx.restore();
        }
        else {
            bufferCtx.drawImage(texture.baseTexture,
                texture.config.frame.x, texture.config.frame.y,
                texture.config.frame.w, texture.config.frame.h,
                texture.config.spriteSourceSize.x, texture.config.spriteSourceSize.y,
                texture.config.spriteSourceSize.w, texture.config.spriteSourceSize.h);
        }
        
        cns.getContext("2d").drawImage(buffer,
                                       0, 0,
                                       texture.config.sourceSize.w, texture.config.sourceSize.h,
                                       x - texture.config.sourceSize.w/2, y - texture.config.sourceSize.h/2,
                                       texture.config.sourceSize.w, texture.config.sourceSize.h);
    }
}

export default SpriteViewer;