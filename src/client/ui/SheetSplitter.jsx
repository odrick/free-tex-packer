import React from 'react';

import {Observer, GLOBAL_EVENT} from '../Observer';
import I18 from '../utils/I18';

import FileSystem from 'platform/FileSystem';

import splitters, {getSplitterByData, getSplitterByType} from '../splitters';
import {getDefaultSplitter} from '../splitters';
import LocalImagesLoader from "../utils/LocalImagesLoader";
import ReactDOM from "react-dom";
import Downloader from "platform/Downloader";

class SheetSplitter extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            splitter: getDefaultSplitter()
        };
        
        this.texture = null;
        this.data = null;
        this.frames = null;

        this.buffer = document.createElement('canvas');
        
        this.doSplit = this.doSplit.bind(this);
        this.selectTexture = this.selectTexture.bind(this);
        this.selectDataFile = this.selectDataFile.bind(this);
        this.updateFrames = this.updateFrames.bind(this);
        this.updateView = this.updateView.bind(this);
        this.changeSplitter = this.changeSplitter.bind(this);
    }
    
    componentDidMount() {
        this.updateTexture();
    }
    
    doSplit() {
        Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
        
        if(!this.frames || !this.frames.length) {
            Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f('SPLITTER_ERROR_NO_FRAMES'));
            
            return;
        }
        
        let ctx = this.buffer.getContext('2d');
        let files = [];
        
        for(let item of this.frames) {
            this.buffer.width = item.sourceSize.w;
            this.buffer.height = item.sourceSize.h;
            
            if(item.rotated) {
                ctx.save();

                ctx.translate(item.spriteSourceSize.x + item.spriteSourceSize.w/2, item.spriteSourceSize.y + item.spriteSourceSize.h/2);
                ctx.rotate(-Math.PI/2);

                ctx.drawImage(this.texture,
                    item.frame.x, item.frame.y,
                    item.frame.h, item.frame.w,
                    -item.spriteSourceSize.h/2, -item.spriteSourceSize.w/2,
                    item.spriteSourceSize.h, item.spriteSourceSize.w);
                
                ctx.restore();
            }
            else {
                ctx.drawImage(this.texture,
                    item.frame.x, item.frame.y,
                    item.frame.w, item.frame.h,
                    item.spriteSourceSize.x, item.spriteSourceSize.y,
                    item.spriteSourceSize.w, item.spriteSourceSize.h);
            }

            let ext = item.name.split('.').pop().toLowerCase();
            if(!ext) {
                ext = 'png';
                item.name += '.' + ext;
            }
            
            let base64 = this.buffer.toDataURL(ext === 'png' ? 'image/png' : 'image/jpeg');
            base64 = base64.split(',').pop();

            files.push({
                name: item.name,
                content: base64,
                base64: base64
            });
        }
        
        Downloader.run(files, 'atlas.zip');

        Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
    }

    selectTexture(e) {
        if(e.target.files.length) {
            Observer.emit(GLOBAL_EVENT.SHOW_SHADER);

            let loader = new LocalImagesLoader();
            loader.load(e.target.files, null, data => {
                let keys = Object.keys(data);
                this.texture = data[keys[0]];
                ReactDOM.findDOMNode(this.refs.textureName).innerHTML = keys[0];
                
                this.updateView();

                Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
            });
        }
    }
    
    updateTexture() {
        let canvas = ReactDOM.findDOMNode(this.refs.view);
        
        if(this.texture) {
            canvas.width = this.texture.width;
            canvas.height = this.texture.height;
            canvas.style.display = '';
            
            let ctx = canvas.getContext('2d');
            ctx.drawImage(this.texture, 0, 0);
        }
        else {
            canvas.style.display = 'none';
        }
    }

    selectDataFile(e) {
        if(e.target.files.length) {
            let item = e.target.files[0];
            
            let reader = new FileReader();
            reader.onload = e => {
                
                let content = e.target.result;
                content = content.split(',');
                content.shift();
                content = atob(content);
                
                this.data = content;

                ReactDOM.findDOMNode(this.refs.dataFileName).innerHTML = item.name;
                
                let splitter = getSplitterByData(this.data);
                this.setState({splitter: splitter});
                
                this.updateView();
            };

            reader.readAsDataURL(item);
        }
    }
    
    updateFrames() {
        if(!this.texture) return;
        
        let frames = this.state.splitter.split(this.data, {
            textureWidth: this.texture.width,
            textureHeight: this.texture.height,
            width: ReactDOM.findDOMNode(this.refs.width).value * 1 || 32,
            height: ReactDOM.findDOMNode(this.refs.height).value * 1 || 32,
            padding: ReactDOM.findDOMNode(this.refs.padding).value * 1 || 0
        });
        
        if(frames) {
            this.frames = frames;
            
            let canvas = ReactDOM.findDOMNode(this.refs.view);
            let ctx = canvas.getContext('2d');
            
            for(let item of this.frames) {
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
            
        }
    }
    
    updateView() {
        this.updateTexture();
        this.updateFrames();
    }

    changeSplitter(e) {
        let splitter = getSplitterByType(e.target.value);
        
        this.state.splitter = splitter;
        
        this.setState({splitter: splitter});
        this.updateView();
    }

    close() {
        Observer.emit(GLOBAL_EVENT.HIDE_SHEET_SPLITTER);
    }

    render() {
        let displayGridProperties = this.state.splitter.type === 'Grid' ? '' : 'none';
        
        return (
            <div className="sheet-splitter-shader">
                <div className="sheet-splitter-content">
                    <div className="sheet-splitter-top">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="btn back-800 border-color-gray color-white file-upload">
                                            {I18.f("SELECT_TEXTURE")}
                                            <input type="file" ref="selectTextureInput" accept="image/png,image/jpg,image/jpeg,image/gif" onChange={this.selectTexture} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="back-400 border-color-gray color-black sheet-splitter-info-text" ref="textureName">&nbsp;</div>
                                    </td>
                                    <td>
                                        <div className="btn back-800 border-color-gray color-white file-upload">
                                            {I18.f("SELECT_DATA_FILE")}
                                            <input type="file" ref="selectTextureInput" onChange={this.selectDataFile} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="back-400 border-color-gray color-black sheet-splitter-info-text" ref="dataFileName">&nbsp;</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="sheet-splitter-view">
                        <canvas ref='view'></canvas>
                    </div>

                    <div className="sheet-splitter-controls">
                        <table>
                            <tbody>
                                <tr>
                                    <td>{I18.f('FORMAT')}</td>
                                    <td>
                                        <select ref="dataFormat" className="border-color-gray" value={this.state.splitter.type} onChange={this.changeSplitter}>
                                            {splitters.map(node => {
                                                return (<option key={"data-format-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                            })}
                                        </select>
                                    </td>
                                </tr>
                                <tr style={{display: displayGridProperties}}>
                                    <td>{I18.f('WIDTH')}</td>
                                    <td>
                                        <input type="number" ref='width' defaultValue='128' onChange={this.updateView}/>
                                    </td>
                                </tr>
                                <tr style={{display: displayGridProperties}}>
                                    <td>{I18.f('HEIGHT')}</td>
                                    <td>
                                        <input type="number" ref='height' defaultValue='108' onChange={this.updateView}/>
                                    </td>
                                </tr>
                                <tr style={{display: displayGridProperties}}>
                                    <td>{I18.f('PADDING')}</td>
                                    <td>
                                        <input type="number" ref='padding' defaultValue='0' onChange={this.updateView}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="sheet-splitter-bottom">
                        <div className="btn back-800 border-color-gray color-white" onClick={this.doSplit}>{I18.f("SPLIT")}</div>
                        <div className="btn back-800 border-color-gray color-white" onClick={this.close}>{I18.f("CLOSE")}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SheetSplitter;