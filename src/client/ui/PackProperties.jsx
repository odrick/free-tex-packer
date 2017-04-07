import React from 'react';
import ReactDOM from 'react-dom';

import Storage from '../utils/Storage';

import exporters from '../exporters';
import { getExporterByType } from '../exporters';
import packers from '../packers';
import { getPackerByType } from '../packers';

import {Observer, GLOBAL_EVENT} from '../Observer';

const STORAGE_OPTIONS_KEY = "pack-options";

class PackProperties extends React.Component {
    constructor(props) {
        super(props);

        this.onPackerChange = this.onPackerChange.bind(this);
        this.onPropChanged = this.onPropChanged.bind(this);
        this.onExporterPropChanged = this.onExporterPropChanged.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        
        this.packOptions = this.loadOptions();
        
        this.state = {packer: this.packOptions.packer};
    }
    
    loadOptions() {
        let data = Storage.load(STORAGE_OPTIONS_KEY);
        
        if(!data) data = {};
        
        data.textureName = data.textureName || "texture";
        data.removeFileExtension = data.removeFileExtension === undefined ? false : data.removeFileExtension;
        data.scale = data.scale || 1;
        data.exporter = data.exporter || exporters[0].type;
        data.fileName = data.fileName || "pack-result";
        data.width = data.width === undefined ? 2048 : data.width;
        data.height = data.height === undefined ? 2048 : data.height;
        data.fixedSize = data.fixedSize === undefined ? false : data.fixedSize;
        data.padding = data.padding || 1;
        data.allowRotation = data.allowRotation === undefined ? true : data.allowRotation;
        data.allowTrim = data.allowTrim === undefined ? true : data.allowTrim;
        data.detectIdentical = data.detectIdentical === undefined ? true : data.detectIdentical;
        data.packer = data.packer || packers[0].type;
        data.packerMethod = data.packerMethod || packers[0].methods[0];
        
        return data;
    }
    
    saveOptions() {
        Storage.save(STORAGE_OPTIONS_KEY, this.packOptions);
    }

    componentDidMount() {
        this.emitChanges();
    }
    
    updatePackOptions() {
        this.packOptions.textureName = ReactDOM.findDOMNode(this.refs.textureName).value || "texture";
        this.packOptions.removeFileExtension = ReactDOM.findDOMNode(this.refs.removeFileExtension).checked;
        this.packOptions.scale = Number(ReactDOM.findDOMNode(this.refs.scale).value) || 1;
        this.packOptions.exporter = ReactDOM.findDOMNode(this.refs.exporter).value;
        this.packOptions.fileName = ReactDOM.findDOMNode(this.refs.fileName).value || "pack-result";
        this.packOptions.width = Number(ReactDOM.findDOMNode(this.refs.width).value) || 0;
        this.packOptions.height = Number(ReactDOM.findDOMNode(this.refs.height).value) || 0;
        this.packOptions.fixedSize = ReactDOM.findDOMNode(this.refs.fixedSize).checked;
        this.packOptions.padding = Number(ReactDOM.findDOMNode(this.refs.padding).value) || 0;
        this.packOptions.allowRotation = ReactDOM.findDOMNode(this.refs.allowRotation).checked;
        this.packOptions.allowTrim = ReactDOM.findDOMNode(this.refs.allowTrim).checked;
        this.packOptions.detectIdentical = ReactDOM.findDOMNode(this.refs.detectIdentical).checked;
        this.packOptions.packer = ReactDOM.findDOMNode(this.refs.packer).value;
        this.packOptions.packerMethod = ReactDOM.findDOMNode(this.refs.packerMethod).value;
    }

    getPackOptions() {
        let data = Object.assign({}, this.packOptions);
        data.exporter = getExporterByType(data.exporter);
        data.packer = getPackerByType(data.packer);
        return data;
    }

    emitChanges() {
        Observer.emit(GLOBAL_EVENT.PACK_OPTIONS_CHANGED, this.getPackOptions());
    }

    onPackerChange(e) {
        this.setState({packer: e.target.value});
        this.onPropChanged();
    }
    
    onPropChanged() {
        this.updatePackOptions();
        this.saveOptions();
        
        this.emitChanges();
    }
    
    onExporterPropChanged() {
        this.updatePackOptions();
        this.saveOptions();
        
        Observer.emit(GLOBAL_EVENT.PACK_EXPORTER_CHANGED, this.getPackOptions());
    }

    forceUpdate(e) {
        let key = e.keyCode || e.which;
        if(key == 13) this.onPropChanged();
    }
    
    startExport() {
        Observer.emit(GLOBAL_EVENT.START_EXPORT);
    }

    render() {
        
        return (
            <div className="props-list">
                <div className="pack-properties-containter">
                    <table>
                        <tbody>
                            <tr>
                                <td>texture name</td>
                                <td><input ref="textureName" type="text" defaultValue={this.packOptions.textureName} onBlur={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr>
                                <td>remove file ext</td>
                                <td><input ref="removeFileExtension" type="checkbox" defaultChecked={this.packOptions.removeFileExtension ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr>
                                <td>scale</td>
                                <td><input ref="scale" type="number" min="1" defaultValue={this.packOptions.scale} onBlur={this.onExporterPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>format</td>
                                <td>
                                    <select ref="exporter" onChange={this.onExporterPropChanged} defaultValue={this.packOptions.exporter}>
                                    {exporters.map(node => {
                                        return (<option key={"exporter-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>file name</td>
                                <td><input ref="fileName" type="text" defaultValue={this.packOptions.fileName} onBlur={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="center-align">
                                    <div className="btn" onClick={this.startExport}>Export</div>
                                </td>
                            </tr>
                            
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>width</td>
                                <td><input ref="width" type="number" min="0" defaultValue={this.packOptions.width} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td><input ref="height" type="number" min="0" defaultValue={this.packOptions.height} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr>
                                <td>fixed size</td>
                                <td><input ref="fixedSize" type="checkbox" onChange={this.onPropChanged} defaultChecked={this.packOptions.fixedSize ? "checked" : ""} /></td>
                            </tr>
                            <tr>
                                <td>padding</td>
                                <td><input ref="padding" type="number" defaultValue={this.packOptions.padding} min="0" onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr>
                                <td>allow rotation</td>
                                <td><input ref="allowRotation" type="checkbox" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowRotation ? "checked" : ""} /></td>
                            </tr>
                            <tr>
                                <td>allow trim</td>
                                <td><input ref="allowTrim" type="checkbox" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowTrim ? "checked" : ""}/></td>
                            </tr>
                            <tr>
                                <td>detect identical</td>
                                <td><input ref="detectIdentical" type="checkbox" onChange={this.onPropChanged} defaultChecked={this.packOptions.detectIdentical ? "checked" : ""}/></td>
                            </tr>
                            <tr>
                                <td>packer</td>
                                <td>
                                    <select ref="packer" onChange={this.onPackerChange} defaultValue={this.packOptions.packer}>
                                    {packers.map(node => {
                                        return (<option key={"packer-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>method</td>
                                <td><PackerMethods ref="packerMethod" packer={this.state.packer} defaultMethod={this.packOptions.packerMethod} handler={this.onPropChanged}/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class PackerMethods extends React.Component {
    render() {
        let packer = getPackerByType(this.props.packer);

        if(!packer) {
            throw new Error("Unknown packer " + this.props.packer);
        }

        let items = [];
        
        let methods = Object.keys(packer.methods);
        for(let item of methods) {
            items.push(<option value={item} key={"packer-method-" + item }>{item}</option>);
        }

        return (
            <select onChange={this.props.handler} defaultValue={this.props.defaultMethod} >{items}</select>
        )
    }
}

export default PackProperties;
