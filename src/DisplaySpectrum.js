import React, { useState, useEffect } from 'react';
import './DisplayQuestions.css';
import RainbowTimer from './RainbowTimer';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './Loading';
import { useQuestions } from './QuestionsContext';

const DisplaySpectrum = () => {
    const { questions, userName, questionIds } = useQuestions();
    const [sliderValue, setSliderValue] = useState(50); // Initial value in the middle of the slider
    const [isSliderMoving, setIsSliderMoving] = useState(true); // State to track if the slider is being moved
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(new Array(questions.length).fill(0));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { gameId } = useParams();

    useEffect(() => {
        if (currentQuestionIndex === questions.length - 1 && responses[questions.length - 1] !== 0) {
            if (gameId === 'new-game') {
                createGame();
            } else {
                logResponse();
            }
        }
    }, [currentQuestionIndex, responses, gameId]);

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value, 10));
        setIsSliderMoving(true);
    };

    const handleSliderStop = () => {
        setIsSliderMoving(false);
    };

    useEffect(() => {
        if (!isSliderMoving) {
            moveToNextQuestion();
        }
    }, [isSliderMoving]);

    const createGame = async (retryCount = 0) => {
        setLoading(true);
    
        let userId = localStorage.getItem('userId');
        const payload = {
            userId,
            userName,
            questionSet: questionIds,
            answerSet: responses,
            gameType: "Spectrum"
        };
    
        console.log(payload);
    
        try {
            const response = await fetch('https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/create-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Game created:', data);
                navigate(`/endscreen/${data.gameId}`);
            } else {
                throw new Error('API response not ok');
            }
        } catch (error) {
            console.error('Attempt to create game failed:', error);
            if (retryCount < 3) {
                setTimeout(() => createGame(retryCount + 1), 2000);
            } else {
                console.error('Failed to create game after 3 retries:', error);
            }
        } finally {

        }
    };    

    const logResponse = async (retryCount = 0) => {
        setLoading(true);
    
        let playerId = localStorage.getItem('userId');
        const payload = {
            gameId,
            playerId,
            userName,
            responseSet: responses
        };
    
        console.log(payload);
    
        try {
            const response = await fetch('https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/log-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Response logged:', data);
                navigate(`/result/${gameId}`);
            } else {
                throw new Error('API response not ok');
            }
        } catch (error) {
            console.error('Attempt to log response failed:', error);
            if (retryCount < 3) {
                setTimeout(() => logResponse(retryCount + 1), 2000);
            } else {
                console.error('Failed to log response after 3 retries:', error);
            }
        } finally {

        }
    }; 
    
    const moveToNextQuestion = () => {
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[currentQuestionIndex] = sliderValue;
            return updatedResponses;
        });
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSliderValue(50);
            }, 300);
        }
    };

    const colors = ['#ea2f86', '#f09c0a', '#fae000', '#93e223', '#4070d3', '#493c9e'];

    const interpolateColor = (color1, color2, factor) => {
        const result = color1.slice(1).match(/.{2}/g)
            .map((hex, index) => {
                return Math.round(parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[index], 16) - parseInt(hex, 16)));
            });
        return `rgb(${result.join(',')})`;
    };

    const calculateThumbColor = (value) => {
        if (value >= 100) {
            return colors[colors.length - 1];
        }
        const numColors = colors.length;
        const interval = 100 / (numColors - 1);
        const index = Math.min(Math.floor(value / interval), numColors - 2);
        const factor = (value % interval) / interval;
        return interpolateColor(colors[index], colors[index + 1], factor);
    };

    const thumbColor = calculateThumbColor(sliderValue);
    const { question, options } = questions[currentQuestionIndex];
    let leftLabel = "True";
    let rightLabel = "False";
    if (options === 'A')
    {
        leftLabel = "Rarely";
        rightLabel = "Often";
    }
    else if (options === 'B')
    {
        leftLabel = "Disagree";
        rightLabel = "Agree";
    }

    const roundText = `Wavelength round ${currentQuestionIndex + 1} of ${questions.length}`;

    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
        return <Loading />;
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <div className='round-container'>
                <h6>{roundText}</h6>
            </div>
            <div className="container text-center mt-5">
                <h5 className="fixed-height">{question}</h5>
                <div className="question-container"><RainbowTimer key={currentQuestionIndex} onTimerEnd={moveToNextQuestion} /></div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onMouseUp={handleSliderStop}
                    onTouchEnd={handleSliderStop}
                    className="slider"
                    style={{
                        '--thumb-color': thumbColor
                    }}
                />
                <div className="slider-labels">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            </div>
            <div className="line q-line-seven"></div>
            <div className="line q-line-eight"></div>
            <div className="line q-line-nine"></div>
            <div className="line q-line-ten"></div>
            <div className="line q-line-eleven"></div>
            <div className="line q-line-twelve"></div>
        </div>
    );
};

export default DisplaySpectrum;
