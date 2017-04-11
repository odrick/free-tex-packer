import React from 'react';

import {Observer, GLOBAL_EVENT} from '../Observer';
import I18 from '../utils/I18';

import appInfo from '../../../package.json';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    close() {
        Observer.emit(GLOBAL_EVENT.HIDE_ABOUT);
    }

    render() {
        return (
            <div className="about-shader">
                <div className="about-content">
                    
                    <div className="about-logo"></div>
                    
                    <div className="about-author">
                        <a href={appInfo.authorSite} target="_blank" className="color-300">{appInfo.author}</a>
                    </div>
                    <div className="about-app-info">
                        <span className="about-app-name">{appInfo.displayName}</span>
                        <span className="about-app-version">{appInfo.version}</span>
                    </div>
                    
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{I18.f("ABOUT_SOURCES")}</td>
                                    <td><a href={appInfo.homepage} target="_blank" className="color-300">{appInfo.homepage}</a></td>
                                </tr>
                                <tr>
                                    <td>{I18.f("ABOUT_BUGS")}</td>
                                    <td><a href={appInfo.bugs.url} target="_blank" className="color-300">{appInfo.bugs.url}</a></td>
                                </tr>
                                <tr>
                                    <td>{I18.f("ABOUT_LIBS")}</td>
                                    <td>
                                        <div>
                                            <a href="https://facebook.github.io/react/" target="_blank" className="color-300">React</a>
                                        </div>
                                        <div>
                                            <a href="https://stuk.github.io/jszip/" target="_blank" className="color-300">JSZip</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/eligrey/FileSaver.js" target="_blank" className="color-300">FileSaver.js</a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="about-controls">
                            <div className="btn back-600 border-color-900 color-white" onClick={this.close}>{I18.f("OK")}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default About;