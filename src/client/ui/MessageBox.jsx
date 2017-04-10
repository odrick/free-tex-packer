import React from 'react';

import I18 from '../utils/I18';

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        
        this.buttons = this.props.buttons;
        
        if(!this.buttons) {
            this.buttons = {
                ok: {caption: I18.f("OK")}
            }
        }
        
        //TODO: refactor this shit...
        let keys = Object.keys(this.buttons);
        for(let key of keys) {
            let btn = this.buttons[key];
            if(btn.callback) {
                let cb = btn.callback;
                btn.callback = () => {
                    cb();
                    this.props.closeCallback();
                }
            }
            else btn.callback = this.props.closeCallback;
        }
    }

    render() {
        let buttons = [];
        
        for(let key of Object.keys(this.buttons)) {
            let btn = this.buttons[key];
            buttons.push((<div className="btn back-600 border-color-900 color-white" key={"btn-" + key} onClick={btn.callback}>{btn.caption}</div>));
        }
        
        return (
            <div className="message-box-wrapper">
                <div className="message-box-window">
                    <div className="message-box-content">
                        {this.props.content}
                    </div>
                    <div className="message-box-buttons">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageBox;