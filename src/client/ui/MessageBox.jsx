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
        
        this.close = this.close.bind(this);
    }
    
    close() {
        this.props.closeCallback();
    }

    render() {
        let buttons = [];
        
        for(let key of Object.keys(this.buttons)) {
            let btn = this.buttons[key];
            buttons.push((<MessageBoxButton key={"btn-" + key} caption={btn.caption} callback={btn.callback} parentBox={this} />));
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

class MessageBoxButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        if(this.props.callback) this.props.callback();
        if(this.props.parentBox) this.props.parentBox.close();
    }
    
    render() {
        return (
            <div className="btn back-600 border-color-gray color-white" onClick={this.onClick}>{this.props.caption}</div>
        );
    }
}

export default MessageBox;