import React, { useState, useEffect } from 'react';
import getBackendUrl from '../utils/getBackendUrl';

function RecentPlaythroughs({ game }) {
    const [playthroughs, setPlaythroughs] = useState([]);
    const [selectedTranscript, setSelectedTranscript] = useState(null); // Stores selected transcript
    const [showPopup, setShowPopup] = useState(false); // Controls popup

    useEffect(() => {
        const fetchPlaythroughs = async () => {
            try {
                const response = await fetch(`${getBackendUrl()}/transcripts?gameId=${game._id}`);
                const data = await response.json();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPlaythroughs(data);
            } catch (error) {
                console.error("Failed to fetch playthroughs:", error);
            }
        };

        fetchPlaythroughs();
    }, [game]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleString('en-US', options);
    };

    const handlePlaythroughClick = (transcript) => {
        setSelectedTranscript(transcript);
        setShowPopup(true);
    };

    const closePopup = () => {
        setSelectedTranscript(null);
        setShowPopup(false);
    };

    return (
        <div className="recent-playthroughs">
            <h2>Recent Playthroughs</h2>
            {Array.isArray(playthroughs) && playthroughs.map((playthrough, index) => (
                <React.Fragment key={index}>
                    <button className="playthrough-button" onClick={() => handlePlaythroughClick(playthrough)}>
                        <div>
                            <p><strong>{playthrough.studentName}:</strong> {formatDate(playthrough.createdAt)}</p>
                        </div>
                    </button>
                    &nbsp;
                </React.Fragment>
            ))}
            {showPopup && selectedTranscript && (
                <div className="game-detail-popup">
                    <div className="game-detail-popup-content">
                        <button className="game-detail-close-button" onClick={closePopup}>&#x2716;</button>
                        
                        <div style={{ textAlign: 'center' }}><h3>{selectedTranscript.studentName}</h3>
                        <h5>{formatDate(selectedTranscript.createdAt)} </h5> 
                        <p></p><p></p></div>
                        <div className="transcript-scroll-container">
                            <ul>
                                {selectedTranscript.playhistory.map((entry, index) => (
                                <div key={index}>
                                    {entry.content}<br />
                                    {entry.question}<br />
                                    Chosen Option: <strong>{entry.choiceText}</strong><br />
                                    <p></p>
                                </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function GameDetails({ game, onBack, onEditGame   }) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const hasPages = game.pages && game.pages.length > 0;

    const goToNextPage = () => {
        if (hasPages) {
            setCurrentPageIndex((prevIndex) => Math.min(prevIndex + 1, game.pages.length - 1));
        }
    };

    const goToPreviousPage = () => {
        if (hasPages) {
            setCurrentPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    const deleteGame = async (gameId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this game?");
        if (!confirmDelete) {
            return;
        }

        try {
            console.log(`GameID: ${gameId}`);
            const response = await fetch(`${getBackendUrl()}/games/${gameId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Game deleted successfully.");
                onBack(); // Navigate back or refresh the list
            } else {
                alert("Failed to delete the game.");
            }
        } catch (error) {
            console.error("There was an error deleting the game:", error);
            alert("An error occurred while deleting the game.");
        }
    };

    return (
        <div className='game-detail-wrapper'>
            <section className='game-detail'>
                <div className='game-detail-info'>
                    <div className='game-detail-info-wrapper'>
                        <nav className='game-detail-info-nav'>
                            <h1><strong>{game.title}</strong></h1>
                            <div>
                                <button onClick={onEditGame}><i className="far fa-edit"></i>Edit Game</button>
                                <button onClick={() => deleteGame(game._id)}><i className="fas fa-trash-alt"></i>Delete Game</button>
                            </div>
                        </nav>
                        <p>Author: {game.author}</p>
                        <p>Class Code: {game.class_code}</p>
                        <div className='game-detail-description'>
                            <p>{game.description}</p>
                        </div>
                    </div>
                    <div className='game-detail-image-wrapper'>
                        {game.image && (
                            <img src={`data:image/jpeg;base64,${game.image}`} alt="Game Image" />
                        )}
                    </div>
                </div>

                <div className='game-detail-pages'> 
                    {hasPages ? (
                        <>
                            <nav className='game-detail-pages-nav'>
                                <h3><strong>Page ID:</strong> {game.pages[currentPageIndex].page_id}</h3>
                                <p>Page {currentPageIndex + 1}</p>
                                <div>
                                    <button onClick={goToPreviousPage} disabled={currentPageIndex === 0}>Previous Page</button>
                                    <button onClick={goToNextPage} disabled={currentPageIndex === game.pages.length - 1}>Next Page</button>
                                </div>
                            </nav>
                                
                            <p><strong>Content:</strong> {game.pages[currentPageIndex].content}</p>
                            <p><strong>Question:</strong> {game.pages[currentPageIndex].question}</p>
                            <p><strong>Choices:</strong>
                                <div>
                                    {game.pages[currentPageIndex].choices.map((choice, index) => (
                                        <div key={index}>{index + 1}. {choice.text} {choice.isCorrect ? "(Correct Answer)" : ""} 
                                            <p>{choice.pageNav ? `This choice navigates to room: ${choice.pageNav}` : ""}</p>
                                        </div>
                                    ))}
                                </div>
                            </p>
                            {game.pages[currentPageIndex].image && (
                                <p>
                                    <img src={`${game.pages[currentPageIndex].image}`} alt="Page Image" />
                                </p>
                            )}
                        </>
                    ) : (
                        <h3>No pages available for this game.</h3>
                    )}
                </div>

            </section>

            
                <RecentPlaythroughs game={game} />
            
        
        </div> 
    );
}

export default GameDetails;
