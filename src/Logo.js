import React from 'react';
import './Logo.css';  // Ensure the CSS file is correctly linked

const Logo = () => {
    return (
        <div className="logo-container">
            <span className="logo-text">W</span>
            <div className="logo-circle-one">
                <div className="logo-inner-circle"></div>
                <div className="logo-text lambda">λ</div>
            </div>
            <span className="logo-text letterV">VELENGTH</span>
        </div>
    );
};

export default Logo;
