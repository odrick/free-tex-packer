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

                <div className="main-header-language border-color-900">
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

                <div className="main-header-fb">
                    <div className="fb-like" data-href="http://free-tex-packer.com/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true"></div>
                </div>

                <div className="main-header-twitter">
                    <a href="https://twitter.com/share" className="twitter-share-button" data-url="http://free-tex-packer.com">Tweet</a>
                </div>

                <div className="main-header-donate">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick"/>
                        <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----"/>
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default MainHeader;