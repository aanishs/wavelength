import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EndScreen.css';

const EndScreen = () => {
    const { gameId } = useParams();
    const gameUrl = `https://playwavelength.com/join/${gameId}`;
    const [linkText, setLinkText] = useState(gameUrl);
    const [isCopied, setIsCopied] = useState(false);
    const navigate = useNavigate();
    const canShare = navigator.canShare;

    const handleCopyClick = () => {
        navigator.clipboard.writeText(gameUrl).then(() => {
            setLinkText("Copied to clipboard!");
            setIsCopied(true);
            setTimeout(() => {
                setLinkText(gameUrl);
                setIsCopied(false);
            }, 1500);
        });
    };

    const handleShareClick = () => {
        if (canShare) {
            navigator.share({
                title: 'Join me on Wavelength!',
                text: 'Play Wavelength with me!',
                url: gameUrl,
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch((error) => {
                console.error('Error sharing', error);
            });
        } else {
            console.error('Your browser does not support native sharing');
        }
    };

    const handleSeeFriendsClick = () => {
        navigate(`/scoreboard/${gameId}`);
    };

    return (
        <div className="end-screen container text-center mt-5">
            <h1>Thank You for Playing Wavelength!</h1>
            <p>Share this link with your friends to find your Wavelength Score with them:</p>
            <div className={`link-box ${isCopied ? 'copied' : ''}`} onClick={handleCopyClick}>
                {linkText}
            </div>
            {canShare ? (
                <button onClick={handleShareClick} className="share-button">
                    Share
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 100 100" fill="currentColor" style={{ marginLeft: '4px' }}>
                        <g>
                            <path d="M75 64c-4.8 0-9.1 2.3-11.8 5.8L38.9 55.7c1.5-3.7 1.5-7.8 0-11.5l24.3-14.1c2.7 3.5 7 5.8 11.8 5.8 8.3 0 15-6.7 15-15s-6.7-15-15-15-15 6.7-15 15c0 2 .4 4 1.1 5.7L36.8 40.8C34 37.3 29.8 35 25 35c-8.3 0-15 6.7-15 15s6.7 15 15 15c4.8 0 9.1-2.3 11.8-5.8l24.3 14.1C60.4 75 60 77 60 79c0 8.3 6.7 15 15 15s15-6.7 15-15-6.7-15-15-15zm0-54c6.1 0 11 4.9 11 11s-4.9 11-11 11-11-4.9-11-11 4.9-11 11-11zM25 61c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11zm50 29c-6.1 0-11-4.9-11-11s4.9-11 11-11 11 4.9 11 11-4.9 11-11 11z"></path>
                        </g>
                    </svg>
                </button>
            ) : null} 
            <button className="custom-button" onClick={handleSeeFriendsClick}>
                See how your friends did
                <span className="button-arrow">{'>'}</span>
            </button>
        </div>
    );
};

export default EndScreen;
