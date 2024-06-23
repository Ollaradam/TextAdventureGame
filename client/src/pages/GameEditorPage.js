import React, { useState, useEffect } from 'react';
import GameEditorMainArea from '../components/GameEditorMainArea';
import GameEditorSidebar from '../components/GameEditorSidebar';

const GameEditorPage = () => {
    return (
        <div className="d-flex game-editor-page">
            <GameEditorMainArea />
            <GameEditorSidebar />
        </div>
    );
}

export default GameEditorPage;
