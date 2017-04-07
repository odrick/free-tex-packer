import React from 'react';
import ReactDOM from 'react-dom';
import TreeView from 'react-treeview';

import LocalImagesLoader from '../utils/LocalImagesLoader';
import ZipLoader from '../utils/ZipLoader';

import {Observer, GLOBAL_EVENT} from '../Observer';

let LAST_TREE_ITEM_SELECTED = null;

class ImagesList extends React.Component {
    constructor(props) {
        super(props);
        
        this.addImages = this.addImages.bind(this);
        this.addZip = this.addZip.bind(this);
        this.clear = this.clear.bind(this);
        this.doClear = this.doClear.bind(this);

        this.state = {images: {}};
    }

    addImages(e) {
        Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
        
        let loader = new LocalImagesLoader();
        loader.load(e.target.files, null, data => this.loadImagesComplete(data));
    }
    
    addZip(e) {
        Observer.emit(GLOBAL_EVENT.SHOW_SHADER);
        
        let loader = new ZipLoader();
        loader.load(e.target.files[0], null, data => this.loadImagesComplete(data));
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
                "yes": {caption: "YES", callback: this.doClear},
                "no": {caption: "NO"}
            };
            
            Observer.emit(GLOBAL_EVENT.SHOW_MESSAGE, "Realy clear all images?", buttons);
        }
    }
    
    doClear() {
        Observer.emit(GLOBAL_EVENT.IMAGES_LIST_CHANGED, {});
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, null);
        LAST_TREE_ITEM_SELECTED = null;
        this.setState({images: {}});
    }
    
    createImagesFolder(name, path) {
        return {
            isFolder: true,
            name: name,
            path: path,
            items: []
        };
    }
    
    getImagesTree(data, path="", res=null) {
        
        if(!res) res = this.createImagesFolder("", path);
        
        let names = Object.keys(data);
        
        for(let name of names) {
            let parts = name.split("/");
            let itemName = parts.pop();
            let itemPath = parts.join("/");
            
            if(itemPath == path) {
                res.items.push({
                    img: data[name],
                    path: name,
                    name: itemName
                });
            }
            else {
                let folderName = parts.pop();
                let folderPath = parts.join("/");
                if(folderPath == path) {
                    let present = false;
                    for(let item of res.items) {
                        if(item.isFolder && item.name == folderName) {
                            present = true;
                            break;
                        }
                    }
                    
                    if(!present) {
                        let folder = this.createImagesFolder(folderName, path);
                        res.items.push(folder);
                        this.getImagesTree(data, itemPath, folder);
                    }
                }
            }
        }
        
        return res;
    }
    
    render() {

        let data = this.getImagesTree(this.state.images);

        return (
            <div className="images-list">
                
                <div className="images-controllers">
                    
                    <div className="btn file-upload">
                        Add images
                        <input type="file" ref="addImagesInput" multiple accept="image/png,image/jpg,image/jpeg,image/gif" onChange={this.addImages} />
                    </div>
    
                    <div className="btn file-upload">
                        Add ZIP
                        <input type="file" ref="addZipInput" accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" onChange={this.addZip} />
                    </div>

                    <div className="btn" onClick={this.clear}>
                        Clear
                    </div>

                </div>
                
                <div className="images-tree">
                    <TreePart data={data} />
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
                    
                    if(item.isFolder) {
                        return (
                            <TreeView key={"img_list-" + item.path} nodeLabel={item.name} defaultCollapsed={false}>
                                <TreePart data={item}/>
                            </TreeView>
                        );
                    }
                    
                    return (
                        <TreeItem key={"img_list-" + item.path} data={item}/>
                    );
                })}
            </div>
        );
    }
}

class TreeItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {selected: LAST_TREE_ITEM_SELECTED == this.props.data.path};

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
        LAST_TREE_ITEM_SELECTED = !this.state.selected ? this.props.data.path : null;
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, LAST_TREE_ITEM_SELECTED);
    }

    render() {
        return (
            <div className={"image-list-item" + (this.state.selected ? " selected" : "")} onClick={this.onSelect} >
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