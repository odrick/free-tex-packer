import React from 'react';
import ReactDOM from 'react-dom';

class TextureView extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            back: "grid",
            displayOutline: false,
            selected: null
        };
    }

    componentDidMount() {
        this.updateView();
    }
    
    componentDidUpdate() {
        this.updateView();
    }
    
    updateView() {
        let view = ReactDOM.findDOMNode(this.refs.view);
        if(view) {
            view.width = this.props.buffer.width;
            view.height = this.props.buffer.height;
            
            let ctx = view.getContext("2d");
            
            ctx.clearRect(0, 0, view.width, view.height);
            ctx.drawImage(this.props.buffer, 0, 0, view.width, view.height, 0, 0, view.width, view.height);
            
            view.className = "grid-back";
        }
    }

    render() {
        return (
            <div ref="back" className="texture-view">
                <canvas ref="view"> </canvas>
            </div>
        );
    }
}

export default TextureView;