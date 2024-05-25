import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DonutProgressBar from './DonutProgressBar';
import Loading from './Loading';
import { useQuestions } from './QuestionsContext';

const Result = () => {
    const [score, setScore] = useState(-1);
    const [error, setError] = useState(null);
    const { creatorName } = useQuestions();
    const navigate = useNavigate();
    const { gameId } = useParams(); // Assuming you're using React Router and the gameId is part of the URL

    useEffect(() => {
        const fetchScore = async () => {
            const playerId = localStorage.getItem('userId'); // Retrieve userId stored in local storage
            if (!playerId || !gameId) {
                setError('Invalid game or user information');
                return;
            }

            try {
                const response = await fetch(`https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/get-score?gameId=${gameId}&playerId=${playerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setScore(data.score); 
                } else {
                    navigate('/');
                    throw new Error(data.message || 'Failed to fetch score');
                }
            } catch (err) {
                navigate('/');
                setError(err.message);
            }
        };

        fetchScore();
    }, [gameId]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="container text-center mt-5" style={{ whiteSpace: 'pre-line' }}>
                <h3 style={{ marginBottom: '3vh' }}>Your Wavelength Score <br /> with {creatorName} is</h3>
                {score !== -1 && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <DonutProgressBar percentage={score * 10} />
                    </div>
                )}
            </div>
            <div className="line line-one"></div>
            <div className="line line-two"></div>
            <div className="line line-three"></div>
            <div className="line line-four"></div>
            <div className="line line-five"></div>
            <div className="line line-six"></div>
            <div className="line line-seven"></div>
            <div className="line line-eight"></div>
            <div className="line line-nine"></div>
            <div className="line line-ten"></div>
            <div className="line line-eleven"></div>
            <div className="line line-twelve"></div>
        </div>
    );
};

export default Result;
