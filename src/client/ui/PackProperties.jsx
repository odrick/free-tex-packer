import React from 'react';
import ReactDOM from 'react-dom';

import Storage from '../utils/Storage';

import exporters from '../exporters';
import { getExporterByType } from '../exporters';
import packers from '../packers';
import { getPackerByType } from '../packers';
import filters from '../filters';
import { getFilterByType } from '../filters';

import I18 from '../utils/I18';

import {Observer, GLOBAL_EVENT} from '../Observer';

const STORAGE_OPTIONS_KEY = "pack-options";
const STORAGE_CUSTOM_EXPORTER_KEY = "custom-exporter";

let INSTANCE = null;

class PackProperties extends React.Component {
    constructor(props) {
        super(props);

        INSTANCE = this;

        this.onPackerChange = this.onPackerChange.bind(this);
        this.onPropChanged = this.onPropChanged.bind(this);
        this.onExporterChanged = this.onExporterChanged.bind(this);
        this.onExporterPropChanged = this.onExporterPropChanged.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        
        this.packOptions = this.loadOptions();
        this.loadCustomExporter();
        
        this.state = {packer: this.packOptions.packer};
    }
    
    static get i() {
        return INSTANCE;
    }
    
    setOptions(data) {
        this.packOptions = this.applyOptionsDefaults(data);
        this.saveOptions();
        this.refreshPackOptions();
        this.emitChanges();
    }
    
    loadCustomExporter() {
        let data = Storage.load(STORAGE_CUSTOM_EXPORTER_KEY);
        if(data) {
            let exporter = getExporterByType("custom");
            exporter.allowTrim = data.allowTrim;
            exporter.allowRotation = data.allowRotation;
            exporter.fileExt = data.fileExt;
            exporter.content = data.content;
        }
    }
    
    loadOptions() {
        return this.applyOptionsDefaults(Storage.load(STORAGE_OPTIONS_KEY));
    }
    
    applyOptionsDefaults(data) {
        if(!data) data = {};
        
        data.textureName = data.textureName || "texture";
        data.textureFormat = data.textureFormat || "png";
        data.removeFileExtension = data.removeFileExtension === undefined ? false : data.removeFileExtension;
        data.prependFolderName = data.prependFolderName === undefined ? true : data.prependFolderName;
        data.scale = data.scale || 1;
        data.filter = getFilterByType(data.filter) ? data.filter : filters[0].type;
        data.exporter = getExporterByType(data.exporter) ? data.exporter : exporters[0].type;
        data.base64Export = data.base64Export === undefined ? false : data.base64Export;
        data.tinify = data.tinify === undefined ? false : data.tinify;
        data.tinifyKey = data.tinifyKey === undefined ? "" : data.tinifyKey;
        data.fileName = data.fileName || "pack-result";
        data.width = data.width === undefined ? 2048 : data.width;
        data.height = data.height === undefined ? 2048 : data.height;
        data.fixedSize = data.fixedSize === undefined ? false : data.fixedSize;
        data.powerOfTwo = data.powerOfTwo === undefined ? false : data.powerOfTwo;
        data.padding = data.padding === undefined ? 1 : data.padding;
        data.allowRotation = data.allowRotation === undefined ? true : data.allowRotation;
        data.allowTrim = data.allowTrim === undefined ? true : data.allowTrim;
        data.trimMode = data.trimMode === undefined ? "trim" : data.trimMode;
        data.detectIdentical = data.detectIdentical === undefined ? true : data.detectIdentical;
        data.packer = getPackerByType(data.packer) ? data.packer : packers[0].type;
        
        let methodValid = false;
        let packer = getPackerByType(data.packer);
        let packerMethods = Object.keys(packer.methods);
        for(let method of packerMethods) {
            if(method == data.packerMethod) {
                methodValid = true;
                break;
            }
        }
        
        if(!methodValid) data.packerMethod = packerMethods[0];
        
        return data;
    }
    
    saveOptions(force=false) {
        if(PLATFORM === "web" || force) {
            Storage.save(STORAGE_OPTIONS_KEY, this.packOptions);
        }
    }

    componentDidMount() {
        this.updateEditCustomTemplateButton();
        this.emitChanges();
    }
    
    updatePackOptions() {
        let data = {};
        
        data.textureName = ReactDOM.findDOMNode(this.refs.textureName).value;
        data.textureFormat = ReactDOM.findDOMNode(this.refs.textureFormat).value;
        data.removeFileExtension = ReactDOM.findDOMNode(this.refs.removeFileExtension).checked;
        data.prependFolderName = ReactDOM.findDOMNode(this.refs.prependFolderName).checked;
        data.base64Export = ReactDOM.findDOMNode(this.refs.base64Export).checked;
        data.tinify = ReactDOM.findDOMNode(this.refs.tinify).checked;
        data.tinifyKey = ReactDOM.findDOMNode(this.refs.tinifyKey).value;
        data.scale = Number(ReactDOM.findDOMNode(this.refs.scale).value);
        data.filter = ReactDOM.findDOMNode(this.refs.filter).value;
        data.exporter = ReactDOM.findDOMNode(this.refs.exporter).value;
        data.fileName = ReactDOM.findDOMNode(this.refs.fileName).value;
        data.width = Number(ReactDOM.findDOMNode(this.refs.width).value) || 0;
        data.height = Number(ReactDOM.findDOMNode(this.refs.height).value) || 0;
        data.fixedSize = ReactDOM.findDOMNode(this.refs.fixedSize).checked;
        data.powerOfTwo = ReactDOM.findDOMNode(this.refs.powerOfTwo).checked;
        data.padding = Number(ReactDOM.findDOMNode(this.refs.padding).value) || 0;
        data.allowRotation = ReactDOM.findDOMNode(this.refs.allowRotation).checked;
        data.allowTrim = ReactDOM.findDOMNode(this.refs.allowTrim).checked;
        data.trimMode = ReactDOM.findDOMNode(this.refs.trimMode).value;
        data.detectIdentical = ReactDOM.findDOMNode(this.refs.detectIdentical).checked;
        data.packer = ReactDOM.findDOMNode(this.refs.packer).value;
        data.packerMethod = ReactDOM.findDOMNode(this.refs.packerMethod).value;

        this.packOptions = this.applyOptionsDefaults(data);
    }
    
    refreshPackOptions() {
        ReactDOM.findDOMNode(this.refs.textureName).value = this.packOptions.textureName;
        ReactDOM.findDOMNode(this.refs.textureFormat).value = this.packOptions.textureFormat;
        ReactDOM.findDOMNode(this.refs.removeFileExtension).checked = this.packOptions.removeFileExtension;
        ReactDOM.findDOMNode(this.refs.prependFolderName).checked = this.packOptions.prependFolderName;
        ReactDOM.findDOMNode(this.refs.base64Export).checked = this.packOptions.base64Export;
        ReactDOM.findDOMNode(this.refs.tinify).checked = this.packOptions.tinify;
        ReactDOM.findDOMNode(this.refs.tinifyKey).value = this.packOptions.tinifyKey;
        ReactDOM.findDOMNode(this.refs.scale).value = Number(this.packOptions.scale);
        ReactDOM.findDOMNode(this.refs.filter).value = this.packOptions.filter;
        ReactDOM.findDOMNode(this.refs.exporter).value = this.packOptions.exporter;
        ReactDOM.findDOMNode(this.refs.fileName).value = this.packOptions.fileName;
        ReactDOM.findDOMNode(this.refs.width).value = Number(this.packOptions.width) || 0;
        ReactDOM.findDOMNode(this.refs.height).value = Number(this.packOptions.height) || 0;
        ReactDOM.findDOMNode(this.refs.fixedSize).checked = this.packOptions.fixedSize;
        ReactDOM.findDOMNode(this.refs.powerOfTwo).checked = this.packOptions.powerOfTwo;
        ReactDOM.findDOMNode(this.refs.padding).value = Number(this.packOptions.padding) || 0;
        ReactDOM.findDOMNode(this.refs.allowRotation).checked = this.packOptions.allowRotation;
        ReactDOM.findDOMNode(this.refs.allowTrim).checked = this.packOptions.allowTrim;
        ReactDOM.findDOMNode(this.refs.trimMode).value = this.packOptions.trimMode;
        ReactDOM.findDOMNode(this.refs.detectIdentical).checked = this.packOptions.detectIdentical;
        ReactDOM.findDOMNode(this.refs.packer).value = this.packOptions.packer;
        ReactDOM.findDOMNode(this.refs.packerMethod).value = this.packOptions.packerMethod;
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

    onExporterChanged() {
        let exporter = getExporterByType(ReactDOM.findDOMNode(this.refs.exporter).value);
        let allowTrimInput = ReactDOM.findDOMNode(this.refs.allowTrim);
        let allowRotationInput = ReactDOM.findDOMNode(this.refs.allowRotation);
        
        let doRefresh = (allowTrimInput.checked !== exporter.allowTrim) || 
                        (allowRotationInput.checked !== exporter.allowRotation);
        
        allowTrimInput.checked = exporter.allowTrim;
        allowRotationInput.checked = exporter.allowRotation;
        
        this.updateEditCustomTemplateButton();
        
        this.onExporterPropChanged();
        if(doRefresh) this.onPropChanged();
    }
    
    updateEditCustomTemplateButton() {
        let exporter = getExporterByType(ReactDOM.findDOMNode(this.refs.exporter).value);
        ReactDOM.findDOMNode(this.refs.editCustomFormat).style.visibility = exporter.type === "custom" ? "visible" : "hidden";
    }
    
    onExporterPropChanged() {
        this.updatePackOptions();
        this.saveOptions();
        
        Observer.emit(GLOBAL_EVENT.PACK_EXPORTER_CHANGED, this.getPackOptions());
    }

    forceUpdate(e) {
        if(e) {
            let key = e.keyCode || e.which;
            if (key === 13) this.onPropChanged();
        }
    }
    
    startExport() {
        Observer.emit(GLOBAL_EVENT.START_EXPORT);
    }

    editCustomExporter() {
        Observer.emit(GLOBAL_EVENT.SHOW_EDIT_CUSTOM_EXPORTER);
    }
    
    render() {

        let exporter = getExporterByType(this.packOptions.exporter);
        let exporterRotationDisabled = exporter.allowRotation ? "" : "disabled";
        let exporterTrimDisabled = exporter.allowTrim ? "" : "disabled";
        
        return (
            <div className="props-list back-white">
                <div className="pack-properties-containter">
                    <table>
                        <tbody>
                            <tr title={I18.f("TEXTURE_NAME_TITLE")}>
                                <td>{I18.f("TEXTURE_NAME")}</td>
                                <td><input ref="textureName" type="text" className="border-color-gray" defaultValue={this.packOptions.textureName} onBlur={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("TEXTURE_FORMAT_TITLE")}>
                                <td>{I18.f("TEXTURE_FORMAT")}</td>
                                <td>
                                    <select ref="textureFormat" className="border-color-gray" defaultValue={this.packOptions.textureFormat} onChange={this.onExporterChanged}>
                                        <option value="png">png</option>
                                        <option value="jpg">jpg</option>
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("REMOVE_FILE_EXT_TITLE")}>
                                <td>{I18.f("REMOVE_FILE_EXT")}</td>
                                <td><input ref="removeFileExtension" className="border-color-gray" type="checkbox" defaultChecked={this.packOptions.removeFileExtension ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("PREPEND_FOLDER_TITLE")}>
                                <td>{I18.f("PREPEND_FOLDER")}</td>
                                <td><input ref="prependFolderName" className="border-color-gray" type="checkbox" defaultChecked={this.packOptions.prependFolderName ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("BASE64_EXPORT_TITLE")}>
                                <td>{I18.f("BASE64_EXPORT")}</td>
                                <td><input ref="base64Export" className="border-color-gray" type="checkbox" defaultChecked={this.packOptions.base64Export ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("TINIFY_TITLE")}>
                                <td>{I18.f("TINIFY")}</td>
                                <td><input ref="tinify" className="border-color-gray" type="checkbox" defaultChecked={this.packOptions.tinify ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("TINIFY_KEY_TITLE")}>
                                <td>{I18.f("TINIFY_KEY")}</td>
                                <td><input ref="tinifyKey" type="text" className="border-color-gray" defaultValue={this.packOptions.tinifyKey} onBlur={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("SCALE_TITLE")}>
                                <td>{I18.f("SCALE")}</td>
                                <td><input ref="scale" type="number" min="1" className="border-color-gray" defaultValue={this.packOptions.scale} onBlur={this.onExporterPropChanged}/></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("FILTER_TITLE")}>
                                <td>{I18.f("FILTER")}</td>
                                <td>
                                    <select ref="filter" className="border-color-gray" onChange={this.onExporterChanged} defaultValue={this.packOptions.filter}>
                                        {filters.map(node => {
                                            return (<option key={"filter-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                        })}
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("FORMAT_TITLE")}>
                                <td>{I18.f("FORMAT")}</td>
                                <td>
                                    <select ref="exporter" className="border-color-gray" onChange={this.onExporterChanged} defaultValue={this.packOptions.exporter}>
                                    {exporters.map(node => {
                                        return (<option key={"exporter-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                                <td>
                                    <div className="edit-btn back-800" ref="editCustomFormat" onClick={this.editCustomExporter}></div>
                                </td>
                            </tr>
                            <tr title={I18.f("FILE_NAME_TITLE")}>
                                <td>{I18.f("FILE_NAME")}</td>
                                <td><input ref="fileName" className="border-color-gray" type="text" defaultValue={this.packOptions.fileName} onBlur={this.onExporterPropChanged} /></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="center-align">
                                    <div className="btn back-800 border-color-gray color-white" onClick={this.startExport}>{I18.f("EXPORT")}</div>
                                </td>
                            </tr>
                            
                            <tr title={I18.f("WIDTH_TITLE")}>
                                <td>{I18.f("WIDTH")}</td>
                                <td><input ref="width" type="number" min="0" className="border-color-gray" defaultValue={this.packOptions.width} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("HEIGHT_TITLE")}>
                                <td>{I18.f("HEIGHT")}</td>
                                <td><input ref="height" type="number" min="0" className="border-color-gray" defaultValue={this.packOptions.height} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("FIXED_SIZE_TITLE")}>
                                <td>{I18.f("FIXED_SIZE")}</td>
                                <td><input ref="fixedSize" type="checkbox" className="border-color-gray" onChange={this.onPropChanged} defaultChecked={this.packOptions.fixedSize ? "checked" : ""} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("POWER_OF_TWO_TITLE")}>
                                <td>{I18.f("POWER_OF_TWO")}</td>
                                <td><input ref="powerOfTwo" type="checkbox" className="border-color-gray" onChange={this.onPropChanged} defaultChecked={this.packOptions.powerOfTwo ? "checked" : ""} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("PADDING_TITLE")}>
                                <td>{I18.f("PADDING")}</td>
                                <td><input ref="padding" type="number" className="border-color-gray" defaultValue={this.packOptions.padding} min="0" onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("ALLOW_ROTATION_TITLE")}>
                                <td>{I18.f("ALLOW_ROTATION")}</td>
                                <td><input ref="allowRotation" type="checkbox" className="border-color-gray" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowRotation ? "checked" : ""} disabled={exporterRotationDisabled} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("ALLOW_TRIM_TITLE")}>
                                <td>{I18.f("ALLOW_TRIM")}</td>
                                <td><input ref="allowTrim" type="checkbox" className="border-color-gray" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowTrim ? "checked" : ""}  disabled={exporterTrimDisabled} /></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("TRIM_MODE_TITLE")}>
                                <td>{I18.f("TRIM_MODE")}</td>
                                <td>
                                    <select ref="trimMode" className="border-color-gray" onChange={this.onPropChanged} defaultValue={this.packOptions.trimMode}  disabled={exporterTrimDisabled}>
                                        <option value="trim">trim</option>
                                        <option value="crop">crop</option>
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("DETECT_IDENTICAL_TITLE")}>
                                <td>{I18.f("DETECT_IDENTICAL")}</td>
                                <td><input ref="detectIdentical" type="checkbox" className="border-color-gray" onChange={this.onPropChanged} defaultChecked={this.packOptions.detectIdentical ? "checked" : ""}/></td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("PACKER_TITLE")}>
                                <td>{I18.f("PACKER")}</td>
                                <td>
                                    <select ref="packer" className="border-color-gray" onChange={this.onPackerChange} defaultValue={this.packOptions.packer}>
                                    {packers.map(node => {
                                        return (<option key={"packer-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            <tr title={I18.f("PACKER_METHOD_TITLE")}>
                                <td>{I18.f("PACKER_METHOD")}</td>
                                <td><PackerMethods ref="packerMethod" packer={this.state.packer} defaultMethod={this.packOptions.packerMethod} handler={this.onPropChanged}/></td>
                                <td></td>
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
            <select onChange={this.props.handler} className="border-color-gray" defaultValue={this.props.defaultMethod} >{items}</select>
        )
    }
}

export default PackProperties;
