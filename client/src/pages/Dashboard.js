// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import TopNavDashboard from '../components/TopNavDashboard';
import DashboardGrid from '../components/DashboardGrid';
import AddGame from '../components/AddGame';
import GameDetails from '../components/GameDetails';
import EditGame from '../components/EditGame'; // Ensure this import is correct based on your file structure
import getBackendUrl from '../utils/getBackendUrl';
const Dashboard = () => {
    const [games, setGames] = useState([]); // Add a new state for 'gameDetails'
    const [currentView, setCurrentView] = useState('list'); // State to hold the selected game's details
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        // Re-fetch games when the view changes back to 'list', ensuring that any updates or additions are reflected
        if (currentView === 'list') {
            const fetchGames = async () => {
                console.log('fetching games');
                try {
                    const response = await fetch(`${getBackendUrl()}/educator/adventures`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const data = await response.json();
                    if (!Array.isArray(data)) {
                        console.error('Expected games to be an array but received:', data);
                        setGames([]);
                    } else {
                        setGames(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch games:", error);
                }
            };

            fetchGames();
        }
    }, [currentView]); // Dependency on currentView to re-fetch when needed

    const handleAddGameClick = () => {
        setCurrentView('addGame');
    };

    const handleGameSelect = (game) => {
        setSelectedGame(game);
        setCurrentView('gameDetails'); // Change to the game details view
    };

    const handleEditGameClick = (game) => {
        setSelectedGame(game);
        setCurrentView('editGame'); // Transition to edit game view
    };
    

    return (
        <div className="d-flex dashboard" id="temp-ed-dash">
            <TopNavDashboard />
            {currentView === 'list' && (
                <DashboardGrid 
                    games={games} 
                    onAddGame={handleAddGameClick} 
                    onGameSelect={handleGameSelect} 
                    onEditGame={handleEditGameClick} // Added prop to handle editing games
                />
            )}
            {currentView === 'addGame' && (
                <AddGame onBack={() => setCurrentView('list')} />
            )}
            {currentView === 'gameDetails' && selectedGame && (
                <GameDetails 
                    game={selectedGame} onBack={() => setCurrentView('list')} 
                    onEditGame={() => handleEditGameClick(selectedGame)}
                />
            )}
            {currentView === 'editGame' && selectedGame && (
                <EditGame game={selectedGame} onBack={() => setCurrentView('list')} />
            )}
        </div>
    );
}

export default Dashboard;