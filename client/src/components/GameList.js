import React from 'react';
import { Link } from 'react-router-dom';

function GameList({ games, onDelete, onEdit }) {
    return (
        <table id="games">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {games.map(game => (
                    <tr key={game.game_id}>
                        <td>
                            <Link to={`/games/${game.game_id}`}>{game.title}</Link>
                        </td>
                        <td>{game.author}</td>
                        <td>
                            <button onClick={() => onEdit(game)}>Edit</button>
                        </td>
                        <td>
                            <button onClick={() => onDelete(game.game_id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default GameList;
