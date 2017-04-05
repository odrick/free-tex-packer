import React from 'react';

import exporters from '../exporters';
import { getPackerByType } from '../packers';
import packers from '../packers';

import {Observer, GLOBAL_EVENT} from '../Observer';

class PackProperties extends React.Component {
    constructor(...params) {
        super(...params);

        this.onPackerChange = this.onPackerChange.bind(this);

        this.state = {packer: packers[0].type};
    }

    getPackProps() {

    }

    emitChanges() {
        Observer.emit(GLOBAL_EVENT.PACK_PROPS_CHANGED, this.getPackProps());
    }

    onPackerChange(e) {
        this.setState({packer: e.target.value});
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
                                <td><input type="text" defaultValue="texture" /></td>
                            </tr>
                            <tr>
                                <td>export to</td>
                                <td>
                                    <select>
                                    {exporters.map(node => {
                                        return (<option key={"exporter" + "|" + node.type} defaultValue={node.type}>{node.type}</option>)
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
                                <td><input type="number" min="0"/></td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td><input type="number" min="0"/></td>
                            </tr>
                            <tr>
                                <td>fixed size</td>
                                <td><input type="checkbox"/></td>
                            </tr>
                            <tr>
                                <td>padding</td>
                                <td><input type="number" defaultValue="0" min="0"/></td>
                            </tr>
                            <tr>
                                <td>allow rotation</td>
                                <td><input type="checkbox"/></td>
                            </tr>
                            <tr>
                                <td>allow trim</td>
                                <td><input type="checkbox"/></td>
                            </tr>
                            <tr>
                                <td>detect identical</td>
                                <td><input type="checkbox"/></td>
                            </tr>
                            <tr>
                                <td>packer</td>
                                <td>
                                    <select onChange={this.onPackerChange}>
                                    {packers.map(node => {
                                        return (<option key={"packer" + "|" + node.type} defaultValue={node.type}>{node.type}</option>)
                                    })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>method</td>
                                <td><PackerMethods packer={this.state.packer}/></td>
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
            items.push(<option value={item} key={"packer-method" + "|" + item }>{item}</option>);
        }

        return (
            <select>{items}</select>
        )
    }
}

export default PackProperties;
