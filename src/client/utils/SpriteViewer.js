import "../bin/pixi.min";

class SpriteViewer {

    constructor(data) {

        this.createDOM();
        
        this.data = data;

        this.baseTextures = [];
        this.textures = [];

        this.width = 0;
        this.height = 0;

        for(let part of data) {
            let baseTexture = new PIXI.BaseTexture(part.view.view);
            this.baseTextures.push(baseTexture);

            for(let config of part.data) {
                let rect = config.frame;
                let frame = null;
                let trim = null;
                let orig = new PIXI.Rectangle(0, 0, config.sourceSize.w, config.sourceSize.h);

                if(this.width < config.sourceSize.w) this.width = config.sourceSize.w;
                if(this.height < config.sourceSize.h) this.height = config.sourceSize.h;

                if (config.rotated) {
                    frame = new PIXI.Rectangle(rect.x, rect.y, rect.h, rect.w);
                }
                else {
                    frame = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);
                }

                if (config.trimmed) {
                    trim = new PIXI.Rectangle(
                        config.spriteSourceSize.x,
                        config.spriteSourceSize.y,
                        config.spriteSourceSize.w,
                        config.spriteSourceSize.h
                    );
                }

                let tex = new PIXI.Texture(baseTexture, frame, orig, trim, config.rotated ? 2 : 0);
                tex._name = config.name;
                tex._ix = config.ix;
                this.textures.push(tex);
            }
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.app = new PIXI.Application(this.width, this.height, {backgroundColor : 0x000000, view: this.canvas});
        let p = new PIXI.Container();
        p.position.set(this.width/2, this.height/2);
        this.app.stage.addChild(p);

        this.spriteView = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
        this.spriteView.anchor.set(0.5);

        p.addChild(this.spriteView);

        this.updateSprite();
    }
    
    createDOM() {
        this.container = document.createElement("div");
        this.container.align = "center";
        this.container.style.background = "#ccc";
        this.canvas = document.createElement("canvas");

        let text = document.createElement("span");
        text.innerHTML = "name pattern:";
        this.container.appendChild(text);

        this.patternInput = document.createElement("input");
        this.patternInput.addEventListener("change", () => this.updateSprite());
        this.container.appendChild(this.patternInput);
        this.container.appendChild(document.createElement("br"));

        this.container.appendChild(this.canvas);

        this.container.appendChild(document.createElement("br"));

        text = document.createElement("span");
        text.innerHTML = "speed:";
        this.container.appendChild(text);

        this.speed = document.createElement("input");
        this.speed.addEventListener("change", () => this.updateSprite());
        this.speed.type = "range";
        this.speed.min = 1;
        this.speed.max = 60;
        this.speed.value = 24;
        this.container.appendChild(this.speed);

        this.container.appendChild(document.createElement("br"));
        
        let btn = document.createElement("button");
        btn.innerHTML = "CLOSE";
        btn.addEventListener("click", () => this.close(), false);
        this.container.appendChild(btn);
    }

    updateSprite() {
        let textures = [];
        let pattern = this.patternInput.value;
        
        for(let tex of this.textures) {
            if(pattern.length > 0) {
                if(tex._name.substr(0, pattern.length) == pattern) {
                    textures.push(tex);
                }
            }
            else {
                textures.push(tex);
            }
        }
        
        if(!textures.length) {
            this.spriteView.visible = false;
        }
        else {

            textures = textures.sort((a, b) => {
                if(a._ix > b._ix) return 1;
                if(a._ix < b._ix) return -1;
                return 0;
            });

            this.spriteView.visible = true;
            
            this.spriteView.textures = textures;

            this.spriteView.animationSpeed = this.speed.value / 60;
            this.spriteView.gotoAndPlay(0);
        }
    }

    show(container=document.body) {
        this.container.style.position = "absolute";
        this.container.style.left = "0px";
        this.container.style.top = "0px";
        container.appendChild(this.container);

    }

    close() {
        this.app.stop();
        
        if(this.container.parentNode) this.container.parentNode.removeChild(this.container);
        else if(this.container.parentElement) this.container.parentElement.removeChild(this.container);
        else {
        }
    }

}

export default SpriteViewer;