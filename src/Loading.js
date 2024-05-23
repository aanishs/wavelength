import React from 'react';
import './Loading.css';  // Assuming you store CSS in a separate file

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-circle-one">
                <div className="loading-inner-circle"></div>
            </div>
        </div>
    );
};

export default Loading;
