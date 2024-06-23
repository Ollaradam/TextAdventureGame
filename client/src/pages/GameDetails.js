import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getBackendUrl from '../utils/getBackendUrl';
function GameDetailsPage() {
    const { gameId } = useParams(); // Extract gameId from URL parameters
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${getBackendUrl()}/games/${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game details');
                }
                const data = await response.json();
                setGame(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (gameId) {
            fetchGame();
        }
    }, [gameId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>Game not found</div>;
    }

    return (
        <div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            {/* Render more details about the game */}
        </div>
    );
}

export default GameDetailsPage;
