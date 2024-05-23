import React, { useState, useEffect } from 'react';
import './DonutProgressBar.css';

const DonutProgressBar = ({ percentage }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);

    useEffect(() => {
        if (percentage > 0) {
            const interval = setInterval(() => {
                setDisplayPercentage(prev => {
                    if (prev < percentage) {
                        return prev + 1; // Increment the displayed percentage
                    } else {
                        clearInterval(interval); // Stop the interval when the target is reached
                        return prev;
                    }
                });
            }, 20); // Adjust the interval speed to your liking
            return () => clearInterval(interval); // Clean up the interval on component unmount
        }
    }, [percentage]);

    const getGradient = (displayPercentage) => {
        const colorStops = [
            { color: '#ea2f86', stop: 0 },
            { color: '#ea2f86', stop: 10 },
            { color: '#f09c0a', stop: 20 },
            { color: '#f09c0a', stop: 30 },
            { color: '#fae000', stop: 40 },
            { color: '#fae000', stop: 50 },
            { color: '#93e223', stop: 60 },
            { color: '#93e223', stop: 70 },
            { color: '#4070d3', stop: 80 },
            { color: '#4070d3', stop: 90 },
            { color: '#493c9e', stop: 100 }
        ];

        let gradient = colorStops.reduce((acc, stop) => {
            if (displayPercentage >= stop.stop) {
                acc += `${stop.color} ${stop.stop}%, `;
            } else if (acc === '') { // This covers the case where the percentage is less than the first stop
                acc += `${stop.color} ${displayPercentage}%, black ${displayPercentage}%, black 100%`;
                return acc;
            }
            return acc;
        }, '');

        // Close the gradient if no black was added (i.e., percentage was >= last stop)
        if (!gradient.includes('black')) {
            gradient += `black ${displayPercentage}%, black 100%`;
        }

        return `conic-gradient(${gradient})`;
    };

    return (
        <div className="circle-one" style={{ background: getGradient(displayPercentage) }}>
            <div className="inner-circle"></div>
            <div className="percentage">
                {Math.floor(displayPercentage / 10)}
            </div>
        </div>
    );
}

export default DonutProgressBar;
