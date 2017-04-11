import React from 'react';

class TreeView extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        
        this.state = {
            collapsed: this.props.defaultCollapsed
        };
    }

    handleClick(...args) {
        this.setState({collapsed: !this.state.collapsed});
        if (this.props.onClick) {
            this.props.onClick(...args);
        }
    }

    render() {
        let {
            collapsed = this.state.collapsed,
            className = '',
            itemClassName = '',
            nodeLabel,
            children,
            defaultCollapsed,
            ...rest,
        } = this.props;

        let arrowClassName = 'tree-view-arrow';
        let containerClassName = 'tree-view-children';
        if (collapsed) {
            arrowClassName += ' tree-view-arrow-collapsed';
            containerClassName += ' tree-view-children-collapsed';
        }

        let arrow = (<div {...rest} className={className + ' ' + arrowClassName}/>);
        let folderIcon = (<div className="tree-view-folder"></div>);
                
        return (
            <div className="tree-view">
                <div className={'tree-view-item ' + itemClassName} onClick={this.handleClick}>
                    {arrow}
                    {folderIcon}
                    {nodeLabel}
                </div>
                <div className={containerClassName}>
                    {children}
                </div>
            </div>
        );
    }
}

export default TreeView;