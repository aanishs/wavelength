import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Scoreboard.css'; // Make sure to import your new CSS
import Loading from './Loading';

const Scoreboard = () => {
    const { gameId } = useParams();
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://6qpujfk4qe.execute-api.us-west-1.amazonaws.com/prod/get-all-players?gameId=${gameId}`);
                const data = await response.json();
                if (response.ok) {
                    setPlayers(data.players);
                } else {
                    throw new Error(data.message || "Failed to fetch scores");
                }
            } catch (err) {
                setError(err.message);
                console.error("Fetching scores failed:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [gameId]);

    if (isLoading) return <Loading />;

    return (
        <div>
            <div className="scoreboard">
                {players.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.playerID}>
                                    <td>{player.playerName}</td>
                                    <td>{player.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p><center>Looks like no one has played yet.</center></p>
                )}
            </div>
            <div className="s-line s-line-one"></div>
            <div className="s-line s-line-two"></div>
            <div className="s-line s-line-three"></div>
            <div className="s-line s-line-four"></div>
            <div className="s-line s-line-five"></div>
            <div className="s-line s-line-six"></div>
        </div>
    );
};

export default Scoreboard;
