import React from 'react';
import ReactDOM from 'react-dom';
import TreeView from './TreeView.jsx';

import LocalImagesLoader from '../utils/LocalImagesLoader';
import ZipLoader from '../utils/ZipLoader';
import I18 from '../utils/I18';

import {Observer, GLOBAL_EVENT} from '../Observer';

class ImagesList extends React.Component {
    constructor(props) {
        super(props);
        
        this.addImages = this.addImages.bind(this);
        this.addZip = this.addZip.bind(this);
        this.clear = this.clear.bind(this);
        this.doClear = this.doClear.bind(this);
        this.onFilesDrop = this.onFilesDrop.bind(this);

        this.state = {images: {}};
    }
    
    componentDidMount() {
        let dropZone = ReactDOM.findDOMNode(this.refs.imagesTree);
        if(dropZone) {
            dropZone.ondrop = this.onFilesDrop;

            dropZone.ondragover = () => {
                return false;
            };

            dropZone.ondragleave = () => {
                return false;
            };
        }
    }
    
    onFilesDrop(e) {
        e.preventDefault();
        
        if(e.dataTransfer.files.length) {
            let loader = new LocalImagesLoader();
            loader.load(e.dataTransfer.files, null, data => this.loadImagesComplete(data));
        }
        
        return false;
    }

    addImages(e) {
        if(e.target.files.length) {
            Observer.emit(GLOBAL_EVENT.SHOW_SHADER);

            let loader = new LocalImagesLoader();
            loader.load(e.target.files, null, data => this.loadImagesComplete(data));
        }
    }
    
    addZip(e) {
        let file = e.target.files[0];
        if(file) {
            Observer.emit(GLOBAL_EVENT.SHOW_SHADER);

            let loader = new ZipLoader();
            loader.load(file, null, data => this.loadImagesComplete(data));
        }
    }

    loadImagesComplete(data) {

        Observer.emit(GLOBAL_EVENT.HIDE_SHADER);
        
        ReactDOM.findDOMNode(this.refs.addImagesInput).value = "";
        ReactDOM.findDOMNode(this.refs.addZipInput).value = "";
        
        let images = this.state.images;
        
        let names = Object.keys(data);
        
        for(let name of names) {
            images[name] = data[name];
        }
        
        this.setState({images: images});
        Observer.emit(GLOBAL_EVENT.IMAGES_LIST_CHANGED, images);
    }

    clear() {
        let keys = Object.keys(this.state.images);
        if(keys.length) {
            let buttons = {
                "yes": {caption: I18.f("YES"), callback: this.doClear},
                "no": {caption: I18.f("NO")}
            };
            
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, I18.f("CLEAR_WARNING"), buttons);
        }
    }
    
    doClear() {
        Observer.emit(GLOBAL_EVENT.IMAGES_LIST_CHANGED, {});
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, null);
        this.setState({images: {}});
    }
    
    createImagesFolder(name="", path="") {
        return {
            isFolder: true,
            name: name,
            path: path,
            items: []
        };
    }

    getImageSubFolder(root, parts) {
        parts = parts.slice();

        let folder = null;

        while(parts.length) {
            let name = parts.shift();

            folder = null;

            for (let item of root.items) {
                if (item.isFolder && item.name == name) {
                    folder = item;
                    break;
                }
            }

            if (!folder) {
                folder = this.createImagesFolder(name, parts.join("/") + "/" + name);
                root.items.push(folder);
            }

            root = folder;
        }

        return folder || root;
    }

    getImagesTree() {
        let res = this.createImagesFolder();

        let keys = Object.keys(this.state.images);

        for(let key of keys) {
            let parts = key.split("/");
            let name = parts.pop();
            let folder = this.getImageSubFolder(res, parts);

            folder.items.push({
                img: this.state.images[key],
                path: key,
                name: name
            });
        }

        return res;
    }
    
    render() {

        let data = this.getImagesTree(this.state.images);
        
        let dropHelp = Object.keys(this.state.images).length > 0 ? null : (<div className="image-drop-help">{I18.f("IMAGE_DROP_HELP")}</div>);

        return (
            <div className="images-list border-color-900 back-white">
                
                <div className="images-controllers border-color-900">
                    
                    <div className="btn back-600 border-color-900 color-white file-upload" title={I18.f("ADD_IMAGES_TITLE")}>
                        {I18.f("ADD_IMAGES")}
                        <input type="file" ref="addImagesInput" multiple accept="image/png,image/jpg,image/jpeg,image/gif" onChange={this.addImages} />
                    </div>
    
                    <div className="btn back-600 border-color-900 color-white file-upload" title={I18.f("ADD_ZIP_TITLE")}>
                        {I18.f("ADD_ZIP")}
                        <input type="file" ref="addZipInput" accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" onChange={this.addZip} />
                    </div>

                    <div className="btn back-600 border-color-900 color-white" onClick={this.clear} title={I18.f("CLEAR_TITLE")}>
                        {I18.f("CLEAR")}
                    </div>

                </div>
                
                <div ref="imagesTree" className="images-tree">
                    <TreePart data={data} />
                    {dropHelp}
                </div>
                
            </div>
        );
    }
}

class TreePart extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        if(!this.props.data || !this.props.data.items.length) {
            return (<span>&nbsp;</span>);
        }
        
        return (
            <div>
                {this.props.data.items.map((item) => {

                    let key = item.path;

                    if(item.isFolder) {

                        return (
                            <TreeView key={"img-list-folder-" + key} label={item.name}>
                                <TreePart data={item}/>
                            </TreeView>
                        );
                    }

                    return (
                        <TreeItem key={"img-list-item-" + key} data={item}/>
                    );
                })}
            </div>
        );
    }
}

class TreeItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {selected: false};

        this.onSelect = this.onSelect.bind(this);
        Observer.on(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onOtherSelected, this);
    }

    componentWillUnmount() {
        Observer.off(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onOtherSelected, this);
    }
    
    onOtherSelected(path) {
        let currentState = this.state.selected;
        let newState = path == this.props.data.path;

        if(currentState != newState) {
            this.setState({selected: newState});
        }
    }
    
    onSelect() {
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, !this.state.selected ? this.props.data.path : null);
    }

    render() {
        return (
            <div className={"image-list-item" + (this.state.selected ? " back-300 color-white" : "")} onClick={this.onSelect} >
                <div className="image-list-image-container">
                    <img src={this.props.data.img.src} className="image-list-image" />
                </div>
                <div className="image-list-name-container">
                    {this.props.data.name}
                </div>
            </div>
        );
    }
}

export default ImagesList;