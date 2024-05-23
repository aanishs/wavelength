import React, { useState, useEffect } from 'react';
import { useQuestions } from './QuestionsContext';
import './DisplayQuestions.css';
import Loading from './Loading';
import { useNavigate, useParams } from 'react-router-dom';


const ClockTimer = ({ onTimerEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onTimerEnd, 7000); // 7 seconds for full rotation
        return () => clearTimeout(timer);
    }, [onTimerEnd]);

    return (
        <div className="clock">
            <div className="hand"></div>
        </div>
    );
}

const DisplayQuestions = () => {
    const { questions, userName, questionIds } = useQuestions();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(new Array(questions.length).fill(0));
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { gameId } = useParams();

    const colors = ['white', 'white', 'white', 'white'];

    const handleOptionClick = (optionIndex) => {
        setSelectedOptionIndex(optionIndex);
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = optionIndex + 1;
        setResponses(updatedResponses);

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
                setSelectedOptionIndex(-1); // Reset selection
            }, 200); // Delay to show selection effect
        } else {
            if (gameId == 'new-game')
            {
                createGame();
            }
            else
            {
                logResponse();
            }
        }
    };

    if (questions.length === 0) {
        return <Loading />
    }

    const { question, options } = questions[currentQuestionIndex];
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
            <h6>Select the first word that comes to your mind when you hear</h6>
            <h1>{question}</h1>
            <ClockTimer key={currentQuestionIndex} onTimerEnd={moveToNextQuestion} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {options.map((option, index) => (
                    <button
                        key={index}
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '10px 20px',
                            border: '2px solid gray',
                            borderRadius: '5px',
                            boxShadow: selectedOptionIndex === index ? `0 0 5px 2px ${colors[index]}` : 'none',
                        }}
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
        </div>
    );
};

export default DisplayQuestions;
