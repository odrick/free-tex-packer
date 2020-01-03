import React from 'react';

import {Observer, GLOBAL_EVENT} from '../Observer';
import I18 from '../utils/I18';

import appInfo from '../../../package.json';
import exporters from "../exporters";

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    close() {
        Observer.emit(GLOBAL_EVENT.HIDE_ABOUT);
    }
	
	renderDownload() {
		return (
			<tr>
                <td><b>{I18.f("ABOUT_APPS")}</b></td>
				<td><a href={appInfo.download} target="_blank" className="color-800">{appInfo.download}</a></td>
			</tr>
		)
	}
	
	renderWebVersion() {
		return (
			<tr>
                <td><b>{I18.f("ABOUT_WEB")}</b></td>
				<td><a href={appInfo.webApp} target="_blank" className="color-800">{appInfo.webApp}</a></td>
			</tr>
		)
	}

    render() {
        return (
            <div className="about-shader">
                <div className="about-content">
                    
                    <div className="about-logo"></div>
                    
                    <div className="about-app-info">
                        <span className="about-app-name">{appInfo.displayName}</span>
                        <span className="about-app-version">{appInfo.version}</span>
                    </div>
                    
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td><b>{I18.f("ABOUT_HOMEPAGE")}</b></td>
									<td><a href={appInfo.url} target="_blank" className="color-800">{appInfo.url}</a></td>
								</tr>
                                
                                <tr>
                                    <td><b>{I18.f("ABOUT_SOURCES")}</b></td>
                                    <td><a href={appInfo.homepage} target="_blank" className="color-800">{appInfo.homepage}</a></td>
                                </tr>
								
								<tr>
                                    <td><b>{I18.f("ABOUT_BUGS")}</b></td>
									<td><a href={appInfo.bugs.url} target="_blank" className="color-800">{appInfo.bugs.url}</a></td>
								</tr>
                                
								{PLATFORM === "web" ? this.renderDownload() : this.renderWebVersion()}
								
                                <tr>
                                    <td><b>{I18.f("ABOUT_LIBS")}</b></td>
                                    <td>
                                        <div>
                                            <a href="https://facebook.github.io/react" target="_blank" className="color-800">React</a>
                                        </div>
                                        <div>
                                            <a href="https://stuk.github.io/jszip" target="_blank" className="color-800">JSZip</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/eligrey/FileSaver.js" target="_blank" className="color-800">FileSaver.js</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/janl/mustache.js" target="_blank" className="color-800">mustache.js</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/06wj/MaxRectsBinPack" target="_blank" className="color-800">MaxRectsBinPack</a>
                                        </div>
                                        <div>
                                            <a href="https://www.npmjs.com/package/maxrects-packer" target="_blank" className="color-800">MaxRectsPacker</a>
                                        </div>
                                    </td>
                                </tr>
                            
                                <tr>
                                    <td><b>{I18.f("ABOUT_CONTRIBUTORS")}</b></td>
                                    <td className={"contributors-list"}>
                                        {
                                            appInfo.contributors.map(contributor => {
                                                return (
                                                    <a key={'contributor-' + contributor.name} href={contributor.homepage} target="_blank" className="color-800">{contributor.name}</a>
                                                )
                                            }).
                                            reduce((prev, curr) => [prev, ', ', curr])
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="about-controls">
                            <div className="btn back-600 border-color-gray color-white" onClick={this.close}>{I18.f("OK")}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default About;