import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useQuestions } from './QuestionsContext';
import Loading from './Loading';
import Logo from './Logo';
import './Welcome.css';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { storeQuestions } = useQuestions();
    const navigate = useNavigate();
    const { setUserName } = useQuestions();

    const handleInputChange = (event) => {
        setName(event.target.value);
        setUserName(event.target.value);
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/get-questions', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                storeQuestions(data.questions);
                navigate('/game/new-game'); 
            } else {
                throw new Error('Failed to load questions');
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const styleSettings = {
        title: {
            fontSize: '2.8em',
            color: 'white',
            textAlign: 'center',
            marginBottom: '0.5em',
            fontFamily: 'Helvetica'
        },
        inputStyle: {
            maxWidth: '300px',
            margin: 'auto',
            borderRadius: '1',
            height: '38px',
        },
        buttonStyle: {
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            border: '2px solid gray',
            borderRadius: '5px',
            zIndex: '1'
        }
    };

    return (
        <div>
            <div className="container text-center mt-5">
            <h1 style={styleSettings.title}> <Logo />
            </h1>
                <div className="form-group mt-4">
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="What name do you go by?" 
                        value={name} 
                        onChange={handleInputChange}
                        style={styleSettings.inputStyle}
                    />
                </div>
                <div className="d-grid gap-2 mt-3" style={{ maxWidth: '300px', margin: 'auto' }}>
                    <button className="btn btn-secondary btn-lg" type="button" onClick={fetchQuestions} style={styleSettings.buttonStyle} disabled={loading}>
                        {loading ? 'Loading...' : 'Play'}
                    </button>
                </div>
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

export default Welcome;
