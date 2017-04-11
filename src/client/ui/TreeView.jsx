import React from 'react';

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

        let arrow = (<div className={arrowClass}/>);
        let folderIcon = (<div className="tree-view-folder"></div>);
                
        return (
            <div className="tree-view">
                <div className={'tree-view-item'} onClick={this.handleClick}>
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

export default TreeView;