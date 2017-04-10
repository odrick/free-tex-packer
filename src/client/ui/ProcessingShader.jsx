import React from 'react';
import ReactDOM from 'react-dom';

import I18 from '../utils/I18';

class ProcessingShader extends React.Component {
    constructor(props) {
        super(props);
        
        this.showTimer = null;
    }

    componentDidMount() {
        let shader = ReactDOM.findDOMNode(this.refs.shader);
        if(shader) {
            shader.style.visibility = "hidden";

            this.showTimer = setTimeout(() => {
                shader.style.visibility = "visible";
            }, 100);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.showTimer);
    }

    render() {
        return (
            <div ref="shader" className="processing-shader color-white">
                <div className="processing-content">
                    {I18.f("PLEASE_WAIT")}
                </div>
            </div>
        );
    }
}

export default ProcessingShader;