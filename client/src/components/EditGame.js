// client/src/components/EditGame.js
import React, { useState } from 'react';
import AddEditSidebar from './AddEditSidebar';
import AddEditGameInfo from './AddEditGameInfo';
import AddEditGamePageInfo from './AddEditGamePageInfo';
import getBackendUrl from '../utils/getBackendUrl';

function EditGame({ game, onBack }) {

    const [gameDetails, setGameDetails] = useState({
        game: game._id,
        title: game.title || '',
        description: game.description || '',
        author: game.author || '',
        pages: game.pages || [],
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(game.image ? `data:image/jpeg;base64,${game.image}` : null);

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        if (name === 'image' && type === 'file' && files[0]) {
            const file = files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setGameDetails({ ...gameDetails, [name]: value });
        }
    };

    const handlePageChange = (pageIndex, event) => {
        const { name, value, type, files } = event.target;
        const newPages = [...gameDetails.pages];
        const page = newPages[pageIndex];
    
        if (type === 'file' && files[0]) {
            const file = files[0];
            const maxFileSize = 2.5 * 1024 * 1024; // 2.5MB limit
    
            if (file.size > maxFileSize) {
                alert('The image is too large. Please select an image smaller than 2.5MB.');
                event.target.value = ""; 
                return;
            }
    
            const reader = new FileReader();
            reader.onload = (e) => {
                page.image = e.target.result; // Base64 string
                page.imagePreview = URL.createObjectURL(file); // Update preview
                setGameDetails({ ...gameDetails, pages: newPages });
            };
            reader.readAsDataURL(file);
        } else if (name.startsWith('choices-')) {
            const choiceIndex = parseInt(name.split('-')[3], 10);
            if (name.includes('text')) {
                page.choices[choiceIndex].text = value;
            } else if (name.includes('nav')) {
                page.choices[choiceIndex].pageNav = value;
            } else if (name.includes('correct')) {
                page.choices.forEach(choice => choice.isCorrect = false);
                const selectedChoiceIndex = parseInt(value, 10);
                page.choices[selectedChoiceIndex].isCorrect = true;
            }
        } else {
            page[name] = value;
        }
        setGameDetails({ ...gameDetails, pages: newPages });
    };

    const addPage = () => {
        setGameDetails({
            ...gameDetails,
            pages: [...gameDetails.pages, { page_id: '', content: '', question: '', choices: [{ text: '', isCorrect: false, pageNav: '' }], image: null, imagePreview: null }]
        });
    };

    // Remove a page from the game
    const removePage = (pageIndex) => {
        const newPages = [...gameDetails.pages];
        newPages.splice(pageIndex, 1);
        setGameDetails({ ...gameDetails, pages: newPages });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('title', gameDetails.title);
        formData.append('description', gameDetails.description);
        formData.append('author', gameDetails.author);
        if (image && image instanceof File) {
            formData.append('image', image);
        }
    
        // Serialize pages data
        formData.append('pages', JSON.stringify(gameDetails.pages));
        
        try {
            const response = await fetch(`${getBackendUrl()}/games/${game._id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });
            if (response.ok) {
                onBack(); // Navigate back or handle success
            } else {
                console.error('Error. Probably because an image is too large.');
                alert('Error. Probably because an image is too large.');
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this game?");
        if (!confirmDelete) {
            return;
        }
    
        console.log("Attempting to delete game with ID:", game._id);
    
        try {
            const response = await fetch(`${getBackendUrl()}/games/${game._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            if (response.ok) {
                alert("Game deleted successfully.");
                onBack();
            } else {
                const respText = await response.text(); 
                alert(`Failed to delete the game: ${respText}`);
            }
        } catch (error) {
            console.error("There was an error deleting the game:", error);
            alert("An error occurred while deleting the game.");
        }
    };
    
    
    return (
        <div className='add-edit-game-wrap'>
            <AddEditSidebar game={game} addPage={addPage} onBack={onBack} handleSubmit={handleSubmit} isEditing={true} handleDelete={handleDelete} />
            <div className="main-content">
                <AddEditGameInfo game={gameDetails} image={imagePreview} setImage={setImage} handleChange={handleChange} handleSubmit={handleSubmit} />
                {gameDetails.pages.map((page, index) => (
                    <AddEditGamePageInfo key={index} index={index} page={page} game={gameDetails} setGameDetails={setGameDetails} handlePageChange={handlePageChange} removePage={removePage} />
                ))}
            </div>
        </div>
    );
}

export default EditGame;
