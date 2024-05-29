import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DonutProgressBar from './DonutProgressBar';
import Loading from './Loading';
import { useQuestions } from './QuestionsContext';
import './Result.css';

const Result = () => {
    const [score, setScore] = useState(-1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { creatorName, setcreatorName } = useQuestions();
    const [fadeText, setFadeText] = useState('');
    const [showFadeText, setShowFadeText] = useState(false);
    const navigate = useNavigate();
    const { gameId } = useParams();

    useEffect(() => {
        const fetchCreator = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/has-played?gameId=${gameId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setcreatorName(data.playerName); 
                    setLoading(false);
                } else {
                    navigate('/');
                    throw new Error(data.message || 'Failed to fetch score');
                }
            } catch (err) {
                navigate('/');
                setError(err.message);
            }
        };


        const fetchScore = async () => {
            const playerId = localStorage.getItem('userId');
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

        if (!creatorName)
        {
            fetchCreator();
        }
        fetchScore();
    }, [gameId]);

    useEffect(() => {
        if (score == 1) {
            setFadeText('Opposite Poles Attract!');
        } else if (score == 2) {
            setFadeText('Different Beats!');
        } else if (score == 3) {
            setFadeText('Merging Paths!');
        } else if (score == 4) {
            setFadeText('Bridging Views!');
        } else if (score == 5) {
            setFadeText('Syncing Up!');
        } else if (score == 6) {
            setFadeText('Getting in Tune!');
        } else if (score == 7) {
            setFadeText('Melodic Match!');
        } else if (score == 8) {
            setFadeText('In Perfect Rythm!');
        } else if (score == 9) {
            setFadeText('Kindred Spirits!');
        } else if (score == 10) {
            setFadeText('A Match Made in Heaven!');
        }
        
        if (score !== -1) {
            setTimeout(() => {
                setShowFadeText(true);
            }, 1000);
        }
    }, [score]);


    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        border: '2px solid gray',
        borderRadius: '5px',
        zIndex: '1',
        position: 'relative',
        marginTop: '5px'
    };

    const scoreExplanations = {
        1: "Even though your answers greatly differ, there's something exciting about how distinct your perspectives are. Opposites can bring new insights and growth opportunities to each other.",
        2: "You've found a few common notes, indicating a budding understanding and shared views in a couple of areas. There's room to learn more about each other's unique rhythms.",
        3: "Your answers are starting to align, showing that you're on the path to understanding each other better. Your perspectives are more alike than different, paving the way for deeper connections.",
        4: "You are effectively bridging your differences, finding more in common than you may have initially thought. Your views are aligning, building a strong foundation for mutual understanding.",
        5: "You are increasingly in sync, sharing several common opinions and perspectives. This level of agreement shows a solid understanding and similarity in your viewpoints.",
        6: "Your answers are harmonizing well! You're tuning into each other's frequencies, suggesting a promising potential for a strong connection and shared values.",
        7: "Your responses harmonize like a well-composed melody, indicating a deep and resonant connection in your thoughts and values. You're thinking alike in many wonderful ways.",
        8: "You're completely in step with each other, showing that your thoughts and feelings move beautifully together. It's a dance of perfect agreement and mutual understanding.",
        9: "Your responses are nearly identical, revealing that you share a special bond and deep understanding. You truly are kindred spirits, thinking and feeling in remarkable harmony.",
        10: "Perfect score! Your answers align perfectly, suggesting an extraordinary level of compatibility and understanding. It's as if you were meant to think and feel together."
    };    

    if (error) return <div>Error: {error}</div>;

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="container text-center mt-5" style={{ whiteSpace: 'pre-line' }}>
                <h3 style={{ marginBottom: '3vh' }}>Your Wavelength Score <br /> with {creatorName} is</h3>
                {score !== -1 && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <DonutProgressBar percentage={score * 10} />
                    </div>
                )}
                <div className={`score-text ${showFadeText ? 'fade-in' : ''}`}>
                    {fadeText}
                </div>
                {score !== -1 && (
                    <div className="scorecard">
                        {scoreExplanations[score]}
                    </div>
                )}
                <button style={buttonStyle} onClick={() => navigate('/')}>
                    Play A New Game With Your Friends
                </button>
            </div>
            <div className="r-line r-line-one"></div>
            <div className="r-line r-line-two"></div>
            <div className="r-line r-line-three"></div>
            <div className="r-line r-line-four"></div>
            <div className="r-line r-line-five"></div>
            <div className="r-line r-line-six"></div>
            <div className="r-line r-line-seven"></div>
            <div className="r-line r-line-eight"></div>
            <div className="r-line r-line-nine"></div>
            <div className="r-line r-line-ten"></div>
            <div className="r-line r-line-eleven"></div>
            <div className="r-line r-line-twelve"></div>
        </div>
    );
    
};

export default Result;
