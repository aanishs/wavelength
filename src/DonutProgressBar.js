import React, { useState, useEffect } from 'react';
import './DonutProgressBar.css';

const DonutProgressBar = ({ percentage }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);

    useEffect(() => {
        if (percentage > 0) {
            const interval = setInterval(() => {
                setDisplayPercentage(prev => {
                    if (prev < percentage) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20);
            return () => clearInterval(interval);
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
            } else if (acc === '') {
                acc += `${stop.color} ${displayPercentage}%, black ${displayPercentage}%, black 100%`;
                return acc;
            }
            return acc;
        }, '');

        if (!gradient.includes('black')) {
            gradient += `black ${displayPercentage}%, black 100%`;
        }

        return `conic-gradient(${gradient})`;
    };

    return (
        <div className="circle-one" style={{ background: getGradient(displayPercentage) }}>
            <div className="inner-circle"></div>
            <div className="percentage">
                {displayPercentage / 10}
            </div>
        </div>
    );
}

export default DonutProgressBar;
