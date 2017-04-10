import React from 'react';
import {Observer, GLOBAL_EVENT} from '../Observer';
import TextureView from './TextureView.jsx';
import SpritesPlayer from './SpritesPlayer.jsx';
import I18 from '../utils/I18';

class PackResults extends React.Component {
    constructor(props) {
        super(props);

        this.textureBackColors = ["grid-back", "white-back", "pink-back", "black-back"];
        
        this.state = {
            packResult: null,
            textureBack: this.textureBackColors[0],
            displayOutline: false,
            selectedImage: null,
            playerVisible: false
        };
        
        this.setBack = this.setBack.bind(this);
        this.changeOutlines = this.changeOutlines.bind(this);
        this.toggleSpritesPlayer = this.toggleSpritesPlayer.bind(this);

        Observer.on(GLOBAL_EVENT.PACK_COMPLETE, this.updatePackResult, this);
        Observer.on(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onImageSelected, this);
    }
    
    onImageSelected(data) {
        this.setState({selectedImage: data});
    }
    
    updatePackResult(data) {
        this.setState({packResult: data});
    }

    setBack(e) {
        let classNames = e.target.className.split(" ");
        for(let name of classNames) {
            if(this.textureBackColors.indexOf(name) >= 0) {
                this.setState({textureBack: name});
                return;
            }
        }
    }

    clearSelection() {
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, null);
    }

    changeOutlines(e) {
        this.setState({displayOutline: e.target.checked});
    }

    toggleSpritesPlayer() {
        this.setState({playerVisible: !this.state.playerVisible});
    }

    render() {
       
        let views = [], ix=0;
        if(this.state.packResult) {
            for (let item of this.state.packResult) {
                views.push((
                    <TextureView key={"tex-view-" + ix} data={item} textureBack={this.state.textureBack} selectedImage={this.state.selectedImage} displayOutline={this.state.displayOutline} />
                ));
                ix++;
            }
        }
        
        return (
            <div className="results-view border-color-900">
                <div className="results-view-container back-white" onClick={this.clearSelection}>
                    <div className={this.state.playerVisible ? "block-hidden" : "block-visible"}>
                        {views}
                    </div>
                    <div className={!this.state.playerVisible ? "block-hidden" : "block-visible"}>
                        <SpritesPlayer ref="spritesPlayer" data={this.state.packResult} start={this.state.playerVisible} textureBack={this.state.textureBack} />
                    </div>
                </div>

                <div className="results-view-footer back-white border-color-900">
                    {this.textureBackColors.map(name => {
                        return (
                            <div key={"back-color-btn-" + name} className={"btn-back-color " + name + (this.state.textureBack == name ? " selected" : "")} onClick={this.setBack}>&nbsp;</div>
                        )
                    })}
                    
                    <label htmlFor="result-view-outline">{I18.f("DISPLAY_OUTLINES")}</label>
                    <input type="checkbox" id="result-view-outline" onChange={this.changeOutlines} />
                    
                    <div className="btn back-600 border-color-900 color-white" onClick={this.toggleSpritesPlayer}>{I18.f("SHOW_SPRITES")}</div>
                </div>
            </div>
        );
    }
}

export default PackResults;