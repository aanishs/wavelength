import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useQuestions } from './QuestionsContext';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

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
        setLoading(true); // Start loading
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
            setLoading(false); // Stop loading
        }
    };

    if (loading) {
        return <Loading />;
    }

    const styleSettings = {
        title: {
            fontSize: '3em',
            color: 'white',
            textAlign: 'center',
            marginBottom: '0.5em'
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
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1 style={styleSettings.title}>WAVELENGTH</h1>
            <div className="form-group mt-4">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Your Name" 
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
    );
};

export default Welcome;
