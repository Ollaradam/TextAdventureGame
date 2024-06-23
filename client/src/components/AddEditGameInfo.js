// client/src/components/AddEditGameInfo.js
import React, { useState, useEffect } from 'react';

function AddEditGameInfo({ game, image, setImage, handleChange, handleSubmit }) {
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (image) {
            setImagePreview(image);
        }
    }, [image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <form id="game-info-form" className="add-edit-form" onSubmit={handleSubmit}>
            <h2>Game Info</h2>
            <p>Fill in the details of your game</p>
            <span>Title:</span>
            <input type="text" placeholder='Title' name="title" value={game.title} onChange={handleChange} />
            <span>By:</span>
            <input type="text" placeholder='Author' name="author" value={game.author} onChange={handleChange} />
            <span>Description:</span>
            <textarea placeholder='Description' name="description" value={game.description} onChange={handleChange}></textarea>
            <span>Cover Image:</span>
            <input type="file" name="image" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Game preview" />}
        </form>
    );
}

export default AddEditGameInfo;
