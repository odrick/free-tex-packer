import React from 'react';
import ReactDOM from 'react-dom';

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
            <div ref="shader" className="processing-shader">
                <div className="processing-content">
                    Please, wait...
                </div>
            </div>
        );
    }
}

export default ProcessingShader;