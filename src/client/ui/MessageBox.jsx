import React from 'react';

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        
        this.buttons = this.props.buttons;
        
        if(!this.buttons) {
            this.buttons = {
                ok: {caption: "OK"}
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
        
        let keys = Object.keys(this.buttons);
        for(let key of keys) {
            let btn = this.buttons[key];
            buttons.push((<div className="btn" key={"btn-" + key} onClick={btn.callback}>{btn.caption}</div>));
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