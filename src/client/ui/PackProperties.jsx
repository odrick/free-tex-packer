import React from 'react';
import {Observer, GLOBAL_EVENT} from '../Observer';

class PackProperties extends React.Component {
    constructor(...params) {
        super(...params);
    }
    
    render() {
        return (
            <div className="pack-properties-containter">
                <table>
                    <tbody>
                        <tr>
                            <td>file name:</td>
                            <td><input type="text" defaultValue="texture" /></td>
                        </tr>
                        <tr>
                            <td>exporter:</td>
                            <td><select></select></td>
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
                            <td>width:</td>
                            <td><input type="number" min="0"/></td>
                        </tr>
                        <tr>
                            <td>height:</td>
                            <td><input type="number" min="0"/></td>
                        </tr>
                        <tr>
                            <td>fixed size:</td>
                            <td><input type="checkbox"/></td>
                        </tr>
                        <tr>
                            <td>padding:</td>
                            <td><input type="number" defaultValue="0" min="0"/></td>
                        </tr>
                        <tr>
                            <td>allow rotation:</td>
                            <td><input type="checkbox"/></td>
                        </tr>
                        <tr>
                            <td>allow trim:</td>
                            <td><input type="checkbox"/></td>
                        </tr>
                        <tr>
                            <td>detect identical:</td>
                            <td><input type="checkbox"/></td>
                        </tr>
                        <tr>
                            <td>packer:</td>
                            <td><select></select></td>
                        </tr>
                        <tr>
                            <td>method</td>
                            <td><select></select></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default PackProperties;
