import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import getBackendUrl from '../utils/getBackendUrl';
function AddGame() {
    const [game, setGame] = useState({ game_id: '', title: '', description: '', author: '', pages: {} });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setGame({ ...game, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${getBackendUrl()}/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });
            if (response.ok) {
                // Optionally, navigate to the game list or details page after successful addition
                navigate('/games');
            } else {
                throw new Error('Failed to create game');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <header>
                <Link className="App-link" to="/">Home Page</Link>
                <Link className="App-link" to="/games">Games Page</Link>
                <Link className="App-link" to="/add-game">Add a Game</Link>
            </header>
            <h2>Add New Game</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Game ID:
                    <input type="text" name="game_id" value={game.game_id} onChange={handleChange} />
                </label>
                <br />
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
                {/* Add fields for other properties like pages if necessary */}
                <br />
                <button type="submit">Add Game</button>
            </form>
        </div>
    );
}

export default AddGame;
