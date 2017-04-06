import React from 'react';
import ReactDOM from 'react-dom';
import {Observer, GLOBAL_EVENT} from '../Observer';

class PackResults extends React.Component {
    constructor(props) {
        super(props);

        this.textureBackColors = ["grid-back", "white-back", "pink-back", "black-back"];
        
        this.state = {
            packResult: null,
            textureBack: this.textureBackColors[0],
            displayOutline: false,
            selectedImage: null
        };
        
        this.setBack = this.setBack.bind(this);
        this.changeOutlines = this.changeOutlines.bind(this);

        Observer.on(GLOBAL_EVENT.PACK_COMPLETE, this.updatePackResult, this);
        Observer.on(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onImageSelected, this);
    }
    
    onImageSelected(data) {
        this.setState({selectedImage: data});
    }
    
    updatePackResult(data) {
        this.setState({packResult: data});
    }

    setBack(e) {
        let classNames = e.target.className.split(" ");
        for(let name of classNames) {
            if(this.textureBackColors.indexOf(name) >= 0) {
                this.setState({textureBack: name});
                return;
            }
        }
    }

    clearSelection() {
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, null);
    }

    changeOutlines(e) {
        console.log(e.target.checked);
        this.setState({displayOutline: e.target.checked});
    }

    render() {
       
        let views = [], ix=0;
        if(this.state.packResult) {
            for (let item of this.state.packResult) {
                views.push((
                    <TextureView key={"tex-view-" + ix} data={item} textureBack={this.state.textureBack} selectedImage={this.state.selectedImage} displayOutline={this.state.displayOutline} />
                ));
                ix++;
            }
        }
        
        return (
            <div className="results-view">
                <div className="results-view-container" onClick={this.clearSelection}>
                    {views}
                </div>

                <div className="results-view-footer">
                    {this.textureBackColors.map(name => {
                        return (
                            <div key={"back-color-btn-" + name} className={"btn " + name + (this.state.textureBack == name ? " selected" : "")} onClick={this.setBack}>&nbsp;</div>
                        )
                    })}
                    
                    <label htmlFor="result-view-outline">Display outlines:</label>
                    <input type="checkbox" id="result-view-outline" onChange={this.changeOutlines} />
                </div>
            </div>
        );
    }
}

class TextureView extends React.Component {
    constructor(props) {
        super(props);

        this.onViewClick = this.onViewClick.bind(this);
    }

    componentDidMount() {
        this.updateView();
    }

    componentDidUpdate() {
        this.updateView();
    }

    updateView() {
        let view = ReactDOM.findDOMNode(this.refs.view);
        if(view) {
            let highLightItem = null;
            if(this.props.selectedImage) {
                for (let item of this.props.data.data) {
                    if (item.name == this.props.selectedImage) {
                        highLightItem = item;
                        break;
                    }
                }
            }
            
            view.width = this.props.data.buffer.width;
            view.height = this.props.data.buffer.height;

            let ctx = view.getContext("2d");

            ctx.clearRect(0, 0, view.width, view.height);
            
            if(this.props.selectedImage) {
                ctx.globalAlpha = 0.35;
            }
            
            ctx.drawImage(this.props.data.buffer, 0, 0, view.width, view.height, 0, 0, view.width, view.height);

            if(this.props.displayOutline) {
                for (let item of this.props.data.data) {
                    this.drawOutline(ctx, item);
                }
            }

            ctx.globalAlpha = 1;
            
            if(highLightItem) {
                let frame = highLightItem.frame;
                
                let w = frame.w, h = frame.h;
                if(highLightItem.rotated) {
                    w = frame.h;
                    h = frame.w;
                }

                ctx.clearRect(frame.x, frame.y, w, h);
                ctx.drawImage(this.props.data.buffer, frame.x, frame.y, w, h, frame.x, frame.y, w, h);

                if(this.props.displayOutline) this.drawOutline(ctx, highLightItem);

                ctx.beginPath();
                
                if(ctx.setLineDash) ctx.setLineDash([4, 2]);
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.rect(frame.x, frame.y, w, h);
                
                ctx.stroke();
            }

            view.className = this.props.textureBack;
        }
    }
    
    drawOutline(ctx, item) {
        let frame = item.frame;
        let w = frame.w, h = frame.h;
        if(item.rotated) {
            w = frame.h;
            h = frame.w;
        }

        ctx.strokeStyle = "#00F";
        ctx.fillStyle = "rgba(0,0,255,0.25)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.fillRect(frame.x, frame.y, w, h);
        ctx.rect(frame.x, frame.y, w, h);
        ctx.moveTo(frame.x, frame.y);
        ctx.lineTo(frame.x + w, frame.y + h);
        ctx.stroke();
    }
    
    getClickCoords(e) {
        let canvas = ReactDOM.findDOMNode(this.refs.view);
        
        let totalOffsetX = 0,
            totalOffsetY = 0,
            canvasX,
            canvasY,
            currentElement = canvas;

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }
        while (currentElement = currentElement.offsetParent);

        canvasX = e.pageX - totalOffsetX;
        canvasY = e.pageY - totalOffsetY;

        canvasX = Math.round(canvasX * (canvas.width / canvas.offsetWidth));
        canvasY = Math.round(canvasY * (canvas.height / canvas.offsetHeight));

        return {x: canvasX, y: canvasY};
    }
    
    onViewClick(e) {
        let selectedItem = null;
        let coords = this.getClickCoords(e);
        
        for (let item of this.props.data.data) {
            let w = item.frame.w;
            let h = item.frame.h;
            if(item.rotated) {
                w = item.frame.h;
                h = item.frame.w;
            }
            
            if(coords.x >= item.frame.x &&
               coords.x < item.frame.x + w &&
               coords.y >= item.frame.y &&
               coords.y < item.frame.y + h
            ) {
                selectedItem = item;
                break;
            }
        }

        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, selectedItem ? selectedItem.name : null);
        
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    render() {
        return (
            <div ref="back" className="texture-view">
                <canvas ref="view" onClick={this.onViewClick}> </canvas>
            </div>
        );
    }
}

export default PackResults;