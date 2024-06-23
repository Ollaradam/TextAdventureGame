import React from 'react';

const GameEditorSidebar = () => {
    return (
        <div className='d-flex game-editor-sidebar'>
            <header>
            <h2>Elements</h2>
            </header>
            <section className="elements-grid">
                <button>Add Image</button>
                <button>Add Text</button>
                <button>Add Choice</button>
                <button>Add Question</button>
                <button>Add Inventory</button>
                <button>Add Puzzle</button>
                <button>Add NPC</button>
                <button>Add Action</button>
            </section>
        </div>
    );
}

export default GameEditorSidebar;