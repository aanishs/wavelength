import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EndScreen.css';

const EndScreen = () => {
    const { gameId } = useParams();
    const gameUrl = `https://playwavelength.com/join/${gameId}`;
    const [linkText, setLinkText] = useState(gameUrl);
    const navigate = useNavigate();

    const handleCopyClick = () => {
        navigator.clipboard.writeText(gameUrl).then(() => {
            setLinkText("Copied to clipboard!"); // Update text to "Copied to clipboard!"
            setTimeout(() => {
                setLinkText(gameUrl); // Reset back to URL after 3 seconds
            }, 3000);
        });
    };

    const handleSeeFriendsClick = () => {
        navigate(`/scoreboard/${gameId}`);
    };

    return (
        <div className="end-screen container text-center mt-5">
            <h1>Thank You for Playing Wavelength!</h1>
            <p>Share this link with your friends to invite them:</p>
            <div className="link-box" onClick={handleCopyClick}>
                {linkText}
            </div>
            <button className="custom-button" onClick={handleSeeFriendsClick}>
                See how your friends did
            <span className="button-arrow">{'>'}</span>
            </button>
        </div>
    );
};

export default EndScreen;
