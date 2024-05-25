import React, { useState, useEffect } from 'react';
import './RainbowTimer.css';

const RainbowTimer = ({ onTimerEnd }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);
    const totalDuration = 7000; // Total duration of 7 seconds
    const intervalDuration = 10; // Update every 10 milliseconds for smooth animation

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayPercentage(prev => {
                const nextPercentage = prev + (100 / (totalDuration / intervalDuration));
                if (nextPercentage >= 100) {
                    clearInterval(interval);
                    onTimerEnd();  // Call onTimerEnd when the timer reaches or exceeds 100%
                    return 100; // Ensure the percentage does not exceed 100
                }
                return nextPercentage;
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [onTimerEnd]);

    const getColorForTime = (percentage) => {
        const index = Math.floor(percentage / (100 / 6)); // There are 6 color changes over 100%
        const colors = ['#ea2f86', '#f09c0a', '#fae000', '#93e223', '#4070d3', '#493c9e'];
        return colors[index] || colors[colors.length - 1]; // Default to the last color if out of range
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
