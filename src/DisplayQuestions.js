import React, { useState, useEffect } from 'react';
import { useQuestions } from './QuestionsContext';
import './DisplayQuestions.css';
import Loading from './Loading';
import RainbowTimer from './RainbowTimer';
import { useNavigate, useParams } from 'react-router-dom';

const DisplayQuestions = () => {
    const { questions, userName, questionIds } = useQuestions();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(new Array(questions.length).fill(0));
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { gameId } = useParams();
    const colors = ['white', 'white', 'white', 'white'];

    const shuffleOptions = (options) => {
        const optionsWithIndices = options.map((option, index) => ({ option, index }));
        for (let i = optionsWithIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
        }
        return optionsWithIndices;
    };

    useEffect(() => {
        if (currentQuestionIndex === questions.length - 1 && responses[questions.length - 1] !== 0) {
            if (gameId === 'new-game') {
                createGame();
            } else {
                logResponse();
            }
        }
    }, [currentQuestionIndex, responses, gameId]);

    const handleOptionClick = (visualIndex, originalIndex) => {
        setSelectedOptionIndex(visualIndex);
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[currentQuestionIndex] = originalIndex + 1;
            return updatedResponses;
        });
        moveToNextQuestion();
    };

    const createGame = async () => {

        setLoading(true);

        let userId = localStorage.getItem('userId');
    
        const payload = {
            userId,
            userName,
            questionSet: questionIds,
            answerSet: responses
        };

        console.log (payload);
    
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
            }
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };
    
    const logResponse = async () => {

        setLoading(true);

        let playerId = localStorage.getItem('userId');
    
        const payload = {
            gameId,
            playerId,
            userName,
            responseSet: responses
        };

        console.log (payload);
    
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
            }
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOptionIndex(-1);
            }, 200);
        }
    };

    if (questions.length === 0) {
        return <Loading />
    }

    const { question, options } = questions[currentQuestionIndex];
    const shuffledOptions = shuffleOptions(options);
    const roundText = `Wavelength round ${currentQuestionIndex + 1} of ${questions.length}`;

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <div className='round-container'>
                <h6>{roundText}</h6>
            </div>
            <div className="container text-center mt-5">
                <p className="prompt-title">Select the first word that comes to your mind when you hear</p>
                <h1>{question}</h1>
                <div className="question-container"><RainbowTimer key={currentQuestionIndex} onTimerEnd={moveToNextQuestion} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {shuffledOptions.map(({ option, index }, visualIndex) => (
                    <button
                        key={visualIndex}
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '10px 20px',
                            border: '2px solid gray',
                            borderRadius: '5px',
                            height: '70px',
                            boxShadow: selectedOptionIndex === visualIndex ? `0 0 10px 2px ${colors[visualIndex]}` : 'none',
                            zIndex: 1
                        }}
                        onClick={() => handleOptionClick(visualIndex, index)}
                    >
                        {option}
                    </button>
                    ))}
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

export default DisplayQuestions;
