import React from 'react';

const GameEditorMainArea = () => {
    return (
        <div className='d-flex game-editor-main-area'>
            <div className="d-flex editor-frame">
                <header>
                    <span className="editor-title">Room 1: Welcome to the editor</span>
                </header>
                <section className="editor-content">
                    <h1>Welcome! This is an example of a heading.</h1>
                    <p>This is an example of a paragraph block. You can add heading, paragraphs, ordered lists, and more by selecting the “Add Text” element from the side bar to the right and dropping it into the room space. You can also select text blocks and other elements you've added to your rooms directly by clicking on them.</p>
                </section>
                <footer className="add-room-button">
                    <button>Add a Room</button>
                </footer>
            </div>
        </div>
    );
}

export default GameEditorMainArea;
