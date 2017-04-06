import React from 'react';
import ReactDOM from 'react-dom';

import exporters from '../exporters';
import { getExporterByType } from '../exporters';
import packers from '../packers';
import { getPackerByType } from '../packers';

import {Observer, GLOBAL_EVENT} from '../Observer';

class PackProperties extends React.Component {
    constructor(props) {
        super(props);

        this.onPackerChange = this.onPackerChange.bind(this);
        this.onPropChanged = this.onPropChanged.bind(this);

        this.state = {packer: packers[0].type};
    }

    componentDidMount() {
        this.emitChanges();
    }
    
    getPackOptions() {
        let options = {
            fileName: ReactDOM.findDOMNode(this.refs.fileName).value || "texture",
            removeFileExtension: ReactDOM.findDOMNode(this.refs.removeFileExtension).checked,
            exporter: getExporterByType(ReactDOM.findDOMNode(this.refs.exporter).value),
            width: Number(ReactDOM.findDOMNode(this.refs.width).value) || 0,
            height: Number(ReactDOM.findDOMNode(this.refs.height).value) || 0,
            fixedSize: ReactDOM.findDOMNode(this.refs.fixedSize).checked,
            padding: Number(ReactDOM.findDOMNode(this.refs.padding).value) || 0,
            allowRotation: ReactDOM.findDOMNode(this.refs.allowRotation).checked,
            allowTrim: ReactDOM.findDOMNode(this.refs.allowTrim).checked,
            detectIdentical: ReactDOM.findDOMNode(this.refs.detectIdentical).checked,
            packer: getPackerByType(ReactDOM.findDOMNode(this.refs.packer).value),
            packerMethod: ReactDOM.findDOMNode(this.refs.packerMethod).value
        };
        
        console.log(options);
        
        return options;
    }

    emitChanges() {
        Observer.emit(GLOBAL_EVENT.PACK_OPTIONS_CHANGED, this.getPackOptions());
    }

    onPackerChange(e) {
        this.setState({packer: e.target.value});
        this.onPropChanged();
    }
    
    onPropChanged() {
        this.emitChanges();
    }

    render() {

        return (
            <div className="props-list">
                <div className="pack-properties-containter">
                    <table>
                        <tbody>
                            <tr>
                                <td>file name</td>
                                <td><input ref="fileName" type="text" defaultValue="texture" onChange={this.onPropChanged} /></td>
                            </tr>
                            <tr>
                                <td>remove file ext</td>
                                <td><input ref="removeFileExtension" type="checkbox" onChange={this.onPropChanged} /></td>
                            </tr>
                            <tr>
                                <td>export to</td>
                                <td>
                                    <select ref="exporter" onChange={this.onPropChanged}>
                                    {exporters.map(node => {
                                        return (<option key={"exporter-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="center-align">
                                    <div className="btn">Export</div>
                                </td>
                            </tr>
                            
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>width</td>
                                <td><input ref="width" type="number" min="0" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td><input ref="height" type="number" min="0" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>fixed size</td>
                                <td><input ref="fixedSize" type="checkbox" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>padding</td>
                                <td><input ref="padding" type="number" defaultValue="0" min="0" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>allow rotation</td>
                                <td><input ref="allowRotation" type="checkbox" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>allow trim</td>
                                <td><input ref="allowTrim" type="checkbox" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>detect identical</td>
                                <td><input ref="detectIdentical" type="checkbox" onChange={this.onPropChanged}/></td>
                            </tr>
                            <tr>
                                <td>packer</td>
                                <td>
                                    <select ref="packer" onChange={this.onPackerChange}>
                                    {packers.map(node => {
                                        return (<option key={"packer-" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>method</td>
                                <td><PackerMethods ref="packerMethod" packer={this.state.packer} handler={this.onPropChanged}/></td>
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

        for(let item in packer.methods) {
            items.push(<option value={item} key={"packer-method-" + item }>{item}</option>);
        }

        return (
            <select onChange={this.props.handler}>{items}</select>
        )
    }
}

export default PackProperties;
