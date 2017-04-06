import React from 'react';

import ImagesList from './ImagesList.jsx';
import PackProperties from './PackProperties.jsx';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="main-layout">
                <ImagesList/>
                <PackProperties/>
                <div className="result-view" id="resultContainer"></div>
            </div>
        );
    }
}

export default MainLayout;