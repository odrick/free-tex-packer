import React from 'react';
import {GLOBAL_EVENT, Observer} from "../Observer";

class SelectableTree extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <TreePart data={this.props.data} />
        );
    }
}

class TreePart extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if(!this.props.data || !this.props.data.items.length) {
            return (<span>&nbsp;</span>);
        }

        return (
            <div>
                {this.props.data.items.map((item) => {

                    let key = item.path;

                    if(item.isFolder) {

                        return (
                            <TreeView key={"tree-folder-" + key} label={item.name}>
                                <TreePart data={item}/>
                            </TreeView>
                        );
                    }

                    return (
                        <TreeItem key={"tree-item-" + key} data={item}/>
                    );
                })}
            </div>
        );
    }
}

class TreeItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {selected: false};

        this.onSelect = this.onSelect.bind(this);
        Observer.on(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onOtherSelected, this);
    }

    componentWillUnmount() {
        Observer.off(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, this.onOtherSelected, this);
    }

    onOtherSelected(path) {
        let currentState = this.state.selected;
        let newState = path === this.props.data.path;

        if(currentState !== newState) {
            this.setState({selected: newState});
        }
    }

    onSelect() {
        Observer.emit(GLOBAL_EVENT.IMAGE_ITEM_SELECTED, !this.state.selected ? this.props.data.path : null);
    }

    render() {
        return (
            <div className={"image-list-item" + (this.state.selected ? " back-400" : "")} onClick={this.onSelect} >
                <div className="image-list-image-container">
                    <img src={this.props.data.img.src} className="image-list-image" />
                </div>
                <div className="image-list-name-container">
                    {this.props.data.name}
                </div>
            </div>
        );
    }
}

class TreeView extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            collapsed: this.props.defaultCollapsed
        };
    }

    handleClick() {
        this.setState({collapsed: !this.state.collapsed});
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        let collapsed = this.state.collapsed;
        let label = this.props.label;
        let children = this.props.children;

        let arrowClass = 'tree-view-arrow';
        let containerClass = 'tree-view-children';
        if (collapsed) {
            arrowClass += ' tree-view-arrow-collapsed';
            containerClass += ' tree-view-children-collapsed';
        }

        let arrow = (<div className={arrowClass} onClick={this.handleClick}/>);
        let folderIcon = (<div className="tree-view-folder"></div>);

        return (
            <div className="tree-view">
                <div className={'tree-view-item'}>
                    {arrow}
                    {folderIcon}
                    {label}
                </div>
                <div className={containerClass}>
                    {children}
                </div>
            </div>
        );
    }
}

export default SelectableTree;