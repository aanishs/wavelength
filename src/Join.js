import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestions } from './QuestionsContext';
import Loading from './Loading';

const Join = () => {
    const [name, setName] = useState('');
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const { storeQuestions } = useQuestions();
    const navigate = useNavigate();
    const { setUserName } = useQuestions();
    const { setcreatorName } = useQuestions();
    const { gameId } = useParams();

    useEffect(() => {
        const fetchGameInfo = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('userId');
                console.log(gameId);
                console.log(userId);
                const response = await fetch(`https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/is-creator?gameId=${gameId}&userId=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setGameInfo(data);
                    setcreatorName(data.playerName);
                    if(data.isCreator)
                    {
                        navigate(`/endscreen/${gameId}`);
                    }
                    if (data.hasPlayed)
                    {
                        navigate(`/result/${gameId}`);
                    }
                } else {
                    throw new Error('Failed to fetch game info');
                }
            } catch (error) {
                console.error('Error fetching game info:', error);
                navigate(`/`);
            } finally {
                setLoading(false);
            }
        };

        fetchGameInfo();
    }, [gameId]);

    const handleInputChange = (event) => {
        setName(event.target.value);
        setUserName(event.target.value);
    };

    const joinGame = async () => {
        console.log("Joining game with ID: " + gameId);
        setLoading(true);
        try {
            const response = await fetch('https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/join-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId: gameId })  // Make sure to send an object with gameId
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Game joined:', data);
                storeQuestions(data.questions);
                navigate(`/game/${gameId}`);
            } else {
                throw new Error(`Failed to join game: ${data.message}`);
            }
        } catch (error) {
            console.error('Failed to join game:', error);
        } finally {
            setLoading(false);
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
            marginBottom: '0em'
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
            <p>You are joining {gameInfo?.playerName}'s game</p>
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
                <button className="btn btn-secondary btn-lg" type="button" onClick={joinGame} style={styleSettings.buttonStyle} disabled={loading}>
                    {loading ? 'Loading...' : 'Play'}
                </button>
            </div>
        </div>
    );
};

export default Join;
