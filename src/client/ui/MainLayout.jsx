import React from 'react';

import ImagesList from './ImagesList.jsx';
import TempLayout from './TempLayout.jsx';

class MainLayout extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className="main-layout">
                <ImagesList/>

                <div className="props-list">
                    <TempLayout/>
                </div>

                <div className="result-view"></div>
            </div>
        );
    }
}

export default MainLayout;