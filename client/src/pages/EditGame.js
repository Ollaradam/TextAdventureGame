import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import getBackendUrl from '../utils/getBackendUrl';
function EditGame() {
    const { gameId } = useParams(); // Get the gameId from the URL
    const navigate = useNavigate();
    const [game, setGame] = useState({ title: '', description: '', author: '', pages: {} });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(`${getBackendUrl()}/games/${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game details');
                }
                const data = await response.json();
                setGame(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGame();
    }, [gameId]);

    const handleChange = (event) => {
        setGame({ ...game, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${getBackendUrl()}/games/${gameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });
            if (response.ok) {
                // Handle successful update, perhaps navigate back to the game list or details page
                navigate('/games');
            } else {
                throw new Error('Failed to update game');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Game</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" name="title" value={game.title} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description" value={game.description} onChange={handleChange}></textarea>
                </label>
                <br />
                <label>
                    Author:
                    <input type="text" name="author" value={game.author} onChange={handleChange} />
                </label>
                {/* Add fields for other properties as needed */}
                <br />
                <button type="submit">Update Game</button>
            </form>
        </div>
    );
}

export default EditGame;
