import React from 'react';
import {Observer, GLOBAL_EVENT} from '../Observer';
import TextureView from './TextureView.jsx';

class PackResults extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {packResult: null};

        Observer.on(GLOBAL_EVENT.PACK_COMPLETE, this.updatePackResult, this);
    }

    updatePackResult(data) {
        this.setState({packResult: data});
    }

    render() {
       
        let views = [], ix=0;
        if(this.state.packResult) {
            for (let item of this.state.packResult) {
                views.push((
                    <TextureView key={"tex-view-" + ix} buffer={item.buffer}/>
                ));
                ix++;
            }
        }
        
        return (
            <div className="results-view">
                <div className="results-view-container">
                    {views}
                </div>

                <div className="results-view-footer">
                    tools
                </div>
            </div>
        );
    }
}

export default PackResults;