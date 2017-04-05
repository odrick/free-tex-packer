import React from 'react';

import ImagesList from './ImagesList.jsx';
import PackProperties from './PackProperties.jsx';

class MainLayout extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className="main-layout">
                <ImagesList/>

                <div className="props-list">
                    <PackProperties/>
                </div>

                <div className="result-view"></div>
            </div>
        );
    }
}

export default MainLayout;