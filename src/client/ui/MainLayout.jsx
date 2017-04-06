import React from 'react';

import ImagesList from './ImagesList.jsx';
import PackProperties from './PackProperties.jsx';
import PackResults from './PackResults.jsx';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="main-layout">
                <ImagesList/>
                <PackProperties/>
                <PackResults/>
            </div>
        );
    }
}

export default MainLayout;