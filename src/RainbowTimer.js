import React, { useState, useEffect } from 'react';
import './RainbowTimer.css';

const RainbowTimer = ({ onTimerEnd }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);
    const totalDuration = 6000;
    const intervalDuration = 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayPercentage(prev => {
                const nextPercentage = prev + (100 / (totalDuration / intervalDuration));
                if (nextPercentage >= 100) {
                    clearInterval(interval);
                    onTimerEnd();
                    return 100;
                }
                return nextPercentage;
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [onTimerEnd]);

    const getColorForTime = (percentage) => {
        const index = Math.floor(percentage / (100 / 6));
        const colors = ['#ea2f86', '#f09c0a', '#fae000', '#93e223', '#4070d3', '#493c9e'];
        return colors[index] || colors[colors.length - 1];
    };

    const getGradient = (displayPercentage) => {
        const color = getColorForTime(displayPercentage);
        return `conic-gradient(${color} ${displayPercentage}%, black ${displayPercentage + 4}%, black 100%)`;
    };

    return (
        <div className="rt-circle-one" style={{ background: getGradient(displayPercentage) }}>
            <div className="rt-inner-circle"></div>
        </div>
    );
}

export default RainbowTimer;
