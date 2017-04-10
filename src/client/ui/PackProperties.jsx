import React from 'react';
import ReactDOM from 'react-dom';

import Storage from '../utils/Storage';

import exporters from '../exporters';
import { getExporterByType } from '../exporters';
import packers from '../packers';
import { getPackerByType } from '../packers';

import I18 from '../utils/I18';

import {Observer, GLOBAL_EVENT} from '../Observer';

const STORAGE_OPTIONS_KEY = "pack-options";

class PackProperties extends React.Component {
    constructor(props) {
        super(props);

        this.onPackerChange = this.onPackerChange.bind(this);
        this.onPropChanged = this.onPropChanged.bind(this);
        this.onExporterChanged = this.onExporterChanged.bind(this);
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

    onExporterChanged() {
        let exporter = getExporterByType(ReactDOM.findDOMNode(this.refs.exporter).value);
        let allowTrimInput = ReactDOM.findDOMNode(this.refs.allowTrim);
        let allowRotationInput = ReactDOM.findDOMNode(this.refs.allowRotation);
        
        let doRefresh = (allowTrimInput.checked != exporter.allowTrim) || 
                        (allowRotationInput.checked != exporter.allowRotation);
        
        allowTrimInput.checked = exporter.allowTrim;
        allowRotationInput.checked = exporter.allowRotation;
        
        this.onExporterPropChanged();
        if(doRefresh) this.onPropChanged();
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

        let exporter = getExporterByType(this.packOptions.exporter);
        let exporterRotationDisabled = exporter.allowRotation ? "" : "disabled";
        let exporterTrimDisabled = exporter.allowTrim ? "" : "disabled";
        
        return (
            <div className="props-list back-white border-color-900">
                <div className="pack-properties-containter">
                    <table>
                        <tbody>
                            <tr title={I18.f("TEXTURE_NAME_TITLE")}>
                                <td>{I18.f("TEXTURE_NAME")}</td>
                                <td><input ref="textureName" type="text" className="border-color-900" defaultValue={this.packOptions.textureName} onBlur={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr title={I18.f("REMOVE_FILE_EXT_TITLE")}>
                                <td>{I18.f("REMOVE_FILE_EXT")}</td>
                                <td><input ref="removeFileExtension" className="border-color-900" type="checkbox" defaultChecked={this.packOptions.removeFileExtension ? "checked" : ""} onChange={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr title={I18.f("SCALE_TITLE")}>
                                <td>{I18.f("SCALE")}</td>
                                <td><input ref="scale" type="number" min="1" className="border-color-900" defaultValue={this.packOptions.scale} onBlur={this.onExporterPropChanged}/></td>
                            </tr>
                            <tr title={I18.f("FORMAT_TITLE")}>
                                <td>{I18.f("FORMAT")}</td>
                                <td>
                                    <select ref="exporter" className="border-color-900" onChange={this.onExporterChanged} defaultValue={this.packOptions.exporter}>
                                    {exporters.map(node => {
                                        return (<option key={"exporter-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr title={I18.f("FILE_NAME_TITLE")}>
                                <td>{I18.f("FILE_NAME")}</td>
                                <td><input ref="fileName" className="border-color-900" type="text" defaultValue={this.packOptions.fileName} onBlur={this.onExporterPropChanged} /></td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="center-align">
                                    <div className="btn back-600 border-color-900 color-white" onClick={this.startExport}>{I18.f("EXPORT")}</div>
                                </td>
                            </tr>
                            
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            
                            <tr title={I18.f("WIDTH_TITLE")}>
                                <td>{I18.f("WIDTH")}</td>
                                <td><input ref="width" type="number" min="0" className="border-color-900" defaultValue={this.packOptions.width} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr title={I18.f("HEIGHT_TITLE")}>
                                <td>{I18.f("HEIGHT")}</td>
                                <td><input ref="height" type="number" min="0" className="border-color-900" defaultValue={this.packOptions.height} onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr title={I18.f("FIXED_SIZE_TITLE")}>
                                <td>{I18.f("FIXED_SIZE")}</td>
                                <td><input ref="fixedSize" type="checkbox" className="border-color-900" onChange={this.onPropChanged} defaultChecked={this.packOptions.fixedSize ? "checked" : ""} /></td>
                            </tr>
                            <tr title={I18.f("PADDING_TITLE")}>
                                <td>{I18.f("PADDING")}</td>
                                <td><input ref="padding" type="number" className="border-color-900" defaultValue={this.packOptions.padding} min="0" onBlur={this.onPropChanged} onKeyDown={this.forceUpdate}/></td>
                            </tr>
                            <tr title={I18.f("ALLOW_ROTATION_TITLE")}>
                                <td>{I18.f("ALLOW_ROTATION")}</td>
                                <td><input ref="allowRotation" type="checkbox" className="border-color-900" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowRotation ? "checked" : ""} disabled={exporterRotationDisabled} /></td>
                            </tr>
                            <tr title={I18.f("ALLOW_TRIM_TITLE")}>
                                <td>{I18.f("ALLOW_TRIM")}</td>
                                <td><input ref="allowTrim" type="checkbox" className="border-color-900" onChange={this.onPropChanged} defaultChecked={this.packOptions.allowTrim ? "checked" : ""}  disabled={exporterTrimDisabled} /></td>
                            </tr>
                            <tr title={I18.f("DETECT_IDENTICAL_TITLE")}>
                                <td>{I18.f("DETECT_IDENTICAL")}</td>
                                <td><input ref="detectIdentical" type="checkbox" className="border-color-900" onChange={this.onPropChanged} defaultChecked={this.packOptions.detectIdentical ? "checked" : ""}/></td>
                            </tr>
                            <tr title={I18.f("PACKER_TITLE")}>
                                <td>{I18.f("PACKER")}</td>
                                <td>
                                    <select ref="packer" className="border-color-900" onChange={this.onPackerChange} defaultValue={this.packOptions.packer}>
                                    {packers.map(node => {
                                        return (<option key={"packer-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr title={I18.f("PACKER_METHOD_TITLE")}>
                                <td>{I18.f("PACKER_METHOD")}</td>
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
            <select onChange={this.props.handler} className="border-color-900" defaultValue={this.props.defaultMethod} >{items}</select>
        )
    }
}

export default PackProperties;
