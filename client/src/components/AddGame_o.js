// Orginal AddGame.js file before refactoring into four separate components
// Kept in case of issues with refactored components


// client/src/components/AddGame.js
import React, { useState, useEffect } from 'react';
import { getBackendUrl } from '../utils/getBackendUrl';
//import { useNavigate } from 'react-router-dom';

function AddGame({ onBack }) {
    const [game, setGame] = useState({ title: '', description: '', author: '', pages: [] });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // const navigate = useNavigate(); // was using, keeping for reference for later

    useEffect(() => {
        if (image) {
            const previewUrl = URL.createObjectURL(image);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [image]);

    const handleChange = (event) => {
        if (event.target.name === 'image') {
            setImage(event.target.files[0]);
        } else {
            setGame({ ...game, [event.target.name]: event.target.value });
        }
    };

    const handlePageChange = (pageIndex, event) => {
        const { name, value, type } = event.target;
        const pages = [...game.pages];
    
        if (type === 'file') {
            const reader = new FileReader();
            const file = event.target.files[0];
    
            reader.onloadend = () => {
                const imageData = reader.result;
                pages[pageIndex]['image'] = imageData;
                pages[pageIndex]['imagePreview'] = URL.createObjectURL(file);
                setGame({ ...game, pages });
            };
    
            if (file) {
                reader.readAsDataURL(file);
            }
        } else if (name.startsWith('choices-text')) {
            const choiceIndex = parseInt(name.split('-')[3], 10);
            pages[pageIndex].choices[choiceIndex].text = value;
        } else if (name.startsWith('choices-correct')) {
            pages[pageIndex].choices.forEach(choice => choice.isCorrect = false);
            const selectedChoiceIndex = parseInt(value, 10);
            pages[pageIndex].choices[selectedChoiceIndex].isCorrect = true;
        } else if (name.startsWith('choices-nav')) {
            const choiceIndex = parseInt(name.split('-')[3], 10);
            if (value.trim() === '') { // Checks if the input field is cleared
                value = null;
            }
            pages[pageIndex].choices[choiceIndex].pageNav = value;
            
        } else {
            pages[pageIndex][name] = value;
        }
        setGame({ ...game, pages });
    };    
    
    const addPage = () => {
        setGame({
            ...game,
            pages: [...game.pages, { page_id: '', content: '', question: '', choices: [{ text: '', isCorrect: false }], image: '' }]
        });
    };

    const addChoice = (pageIndex) => {
        const newPages = [...game.pages];
        newPages[pageIndex].choices.push({ text: '', isCorrect: false });
        setGame({ ...game, pages: newPages });
    };    

    const removeChoice = (pageIndex, choiceIndex) => {
        const newPages = [...game.pages];
        newPages[pageIndex].choices.splice(choiceIndex, 1);
        setGame({ ...game, pages: newPages });
    };

    const removePage = (index) => {
        const pages = [...game.pages];
        pages.splice(index, 1);
        setGame({ ...game, pages });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('title', game.title);
        formData.append('description', game.description);
        formData.append('author', game.author);
        game.pages.forEach((page, index) => {
            Object.entries(page).forEach(([key, value]) => {
                if (key !== 'choices') {
                    formData.append(`pages[${index}][${key}]`, value);
                } else {
                    page.choices.forEach((choice, choiceIndex) => {
                        formData.append(`pages[${index}][choices][${choiceIndex}][text]`, choice.text);
                        formData.append(`pages[${index}][choices][${choiceIndex}][isCorrect]`, choice.isCorrect);
                        formData.append(`pages[${index}][choices][${choiceIndex}][pageNav]`, choice.pageNav ? choice.pageNav : '');
                    });
                }
            });
        });
        if (image) formData.append('image', image);
    
        try {
            const response = await fetch(`${getBackendUrl()}/games`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (response.ok) {
                onBack();  // Call onBack to switch back to the game listing view instead of navigating
            } else {
                console.error('Error, returning anyway');
                onBack();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <section className='d-flex add-game-wrap'>
            {/* Split this into two sections */}
            <section className='d-flex add-game-form' id='add-game-sec'>
                <h2>Game Info</h2>
                <p>Fill in the details of the game you want to create, including an image.</p>
                <form className='d-flex' onSubmit={handleSubmit}>
                    <label>
                        <input type="text" placeholder='Title' name="title" value={game.title} onChange={handleChange} />
                    </label>
                    <label>
                        <input type="text" placeholder='Author' name="author" value={game.author} onChange={handleChange} />
                    </label>
                    <label>
                        <textarea placeholder='Description' name="description" value={game.description} onChange={handleChange}></textarea>
                    </label>
                    <label>
                        <input type="file" placeholder="Add Image" name="image" onChange={handleChange} />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                            )}
                    </label>
                    {/* Temp */}
                    <p>You can click on "Create Game" below or you can add your first page!</p>
                    <button type="button" onClick={addPage}>Add Page</button>
                </form>
            </section>

            <section className='d-flex add-game-form' id='add-page-sec'>
                <h2>Pages</h2>
                <p>Add pages to your game to create an adventure.</p>
                
                {game.pages.map((page, index) => (
                    <form key={index} className='d-flex' onSubmit={handleSubmit}>
                        
                        <label>
                            <input type="text" placeholder="Page ID" name="page_id" value={page.page_id} onChange={(e) => handlePageChange(index, e)} />
                        </label>
                        <label>
                            <textarea name="content" placeholder="Content" value={page.content} onChange={(e) => handlePageChange(index, e)}></textarea>
                        </label>
                        <label>
                            <input type="text" placeholder="Question" name="question" value={page.question} onChange={(e) => handlePageChange(index, e)} />
                        </label>
                        <label className='d-flex add-game-form'>
                            {page.choices.map((choice, choiceIndex) => (
                                <div key={`choice-${index}-${choiceIndex}`}>
                                    <input
                                        type="text"
                                        placeholder={`Choice ${choiceIndex + 1}`}
                                        name={`choices-text-${index}-${choiceIndex}`}
                                        value={choice.text}
                                        onChange={(e) => handlePageChange(index, e)}
                                    />
                                    <label className='d-flex'>
                                        {/* <input
                                            type="number"
                                            placeholder="Page Nav ID"
                                            name={`choices-nav-${index}-${choiceIndex}`}
                                            value={choice.pageNav || ''}
                                            onChange={(e) => handlePageChange(index, e)}
                                            min="1" 
                                        /> */}
                                        <select
                                            name={`choices-nav-${index}-${choiceIndex}`}
                                            value={choice.pageNav || ''}
                                            onChange={(e) => handlePageChange(index, e)}
                                        >
                                            <option value="">Select Page</option>
                                            {game.pages.map((p, idx) => (
                                                <option key={idx} value={p.page_id}>{p.page_id}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className='d-flex'>
                                        <input
                                            type="radio"
                                            name={`choices-correct-${index}`}
                                            value={choiceIndex}
                                            checked={choice.isCorrect}
                                            onChange={(e) => handlePageChange(index, e)}
                                        /> Correct
                                    </label>
                                </div>
                            ))}
                            <button type="button" onClick={() => addChoice(index)}>Add Choice</button>
                            {page.choices.length > 1 && (
                                <button type="button" onClick={() => removeChoice(index, page.choices.length - 1)}>Remove Choice</button>
                            )}
                        </label>
                        <label>
                
                            <input type="file" placeholder="Add Image" name="image" onChange={(e) => handlePageChange(index, e)} />
                                {page.imagePreview && (
                                    <img src={page.imagePreview} alt="Img Preview" />
                                )}
                        </label>
                        <button type="button" onClick={() => removePage(index)}>Remove Page</button>
                        <button type="button" onClick={addPage}>Add Page</button>
                    </form>
                    ))}
            </section>
            <footer className='add-game-foot'>
                <form className='d-flex' onSubmit={handleSubmit}>
                    <button type="submit">Create Game</button>
                    <button type="button" onClick={onBack}>Cancel</button>
                    {/* Temp 
                    <button type="button" onClick={addPage}>Add Page</button>
                    */}
                </form>
            </footer>
            
        </section>
    );
}

export default AddGame;