import React from 'react';

import appInfo from '../../../package.json';

class MainHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="main-header">
                <div className="main-header-left">
                    {appInfo.name}
                </div>
                <div className="main-header-right">
                    ?
                </div>
            </div>
        );
    }
}

export default MainHeader;