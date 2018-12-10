import React from 'react';

import {Observer, GLOBAL_EVENT} from '../Observer';
import I18 from '../utils/I18';
import appInfo from '../../../package.json';

class MainHeader extends React.Component {
    constructor(props) {
        super(props);

        this.changeLanguage = this.changeLanguage.bind(this);
    }
    
    showAbout() {
        Observer.emit(GLOBAL_EVENT.SHOW_ABOUT);
    }

    changeLanguage(e) {
        Observer.emit(GLOBAL_EVENT.CHANGE_LANG, e.target.value);
    }
    
    render() {
        return (
            <div className="main-header back-900 color-white">
                <div className="main-header-app-name">
                    <img src="static/images/logo.png" />
                    {appInfo.displayName} {appInfo.version}
                </div>

                <div className="main-header-about" onClick={this.showAbout}>
                    ?
                </div>

                <div className="main-header-language border-color-gray">
                    {I18.f("LANGUAGE")}
                    <select defaultValue={I18.currentLocale} onChange={this.changeLanguage}>
                        {
                            appInfo.localizations.map((item) => {
                                return (
                                    <option key={"localization_" + item} value={item}>
                                        {I18.f("LANGUAGE_" + item)}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default MainHeader;