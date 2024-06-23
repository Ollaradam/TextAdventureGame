// server/controllers/adventures_controller.mjs
import fs from 'fs';
import * as games from '../models/adventures_model.mjs';
import Game from '../models/adventures_model.mjs';
import { addGameToEducator } from './educator_controller.mjs';

// Create a new game
export const createGame = async (req, res) => {
    try {
        const classCode = await generateUniqueClassCode();
        const { title, description, author, pages } = req.body;
        const educator = req.user._id;
        let imageBase64 = null;
        if (req.file) {
            // Convert image to Base64 string
            const imgBuffer = fs.readFileSync(req.file.path);
            imageBase64 = imgBuffer.toString('base64');
            // Optionally delete the file after conversion
            fs.unlinkSync(req.file.path);
        }

        const game = await games.createGame(classCode, title, description, author, pages, educator, imageBase64);
        
        // Add the game to the educator's list of adventures
        await addGameToEducator(req.user._id, game._id);  // Updated to use _id
        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating new game:', error);
        res.status(500).json({ message: 'Error creating new game' });
    }
};

export const checkClassCode = async (req, res) => {
    try {
        const { code } = req.body;  // Assuming class code is sent in the request body

        // Find the game with the provided class code
        let game;
        try {
            game = await games.findGameByClassCode(code);
        } catch (error) {
            console.error('Error executing findOne:', error);
        }
        
        if (game) {
            res.status(200).json({ message: 'Matching class code found', game });
        } else {
            res.status(404).json({ message: 'No matching class code found' });
        }
    } catch (error) {
        console.error('Error checking class code:', error);
        res.status(500).json({ message: 'Error checking class code' });
    }
};

// List all games
export const findAllGames = async (req, res) => {
    try {
        const allGames = await games.findAllGames();
        res.json(allGames);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ Error: 'Failed to fetch games' });
    }
};

// Find game by ID
export const findGameById = async (req, res) => {
    try {
        const game = await games.findGameById(req.params._id);  // Use _id for parameter
        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ Error: 'Game not found' });
        }
    } catch (error) {
        console.error('Error finding game:', error);
        res.status(500).json({ Error: 'Request failed' });
    }
};

// Update a game
export const updateGame = async (req, res) => {
    const _id = req.params._id;  // Use _id for parameter

    let { title, description, author, pages } = req.body;
    try {
        if (typeof pages === 'string') {
            pages = JSON.parse(pages);
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid pages data' });
    }

    let updateData = { title, description, author, pages };

    // Handle image update
    if (req.file) {
        const imgBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = imgBuffer.toString('base64');
        updateData.image = imageBase64;
        fs.unlinkSync(req.file.path); // Optionally delete the file after conversion
    }

    try {
        const updatedGame = await games.updateGame(_id, updateData);  // Use _id for updating

        if (!updatedGame) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(updatedGame);
    } catch (error) {
        console.error("Failed to update game:", error);
        res.status(500).json({ message: "Error updating game" });
    }
};

// Delete a game
export const deleteGame = async (req, res) => {
    try {
        console.log(`Deleting game with ID: ${req.params._id}`)
        console.log(req.params)
        const deleted = await games.deleteGame(req.params._id);  // Use _id for deletion
        if (deleted.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: 'Game not found' });
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ Error: 'Request failed' });
    }
};

// Utility function to generate a unique class code
const generateUniqueClassCode = async () => {
    let classCode, existingGame;
    do {
        classCode = generateClassCode();
        existingGame = await games.findGameByClassCode(classCode);
    } while (existingGame);
    return classCode;
};

// Utility function to generate a class code
const generateClassCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Add a page to a game
export const addPageToGame = async (req, res) => {
    const _id = req.params._id;  // Use _id for parameter
    const { page_id, content, question, choices, image } = req.body;

    try {
        const game = await games.findGameById(_id);  // Use _id for fetching
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        let imageBase64 = null;
        if (image) {
            imageBase64 = image;  // Assuming 'image' is already a Base64-encoded string
        }

        const newPage = { page_id, content, question, choices, image: imageBase64 };
        game.pages.push(newPage);

        const updatedGame = await games.updateGame(_id, game);  // Use _id for updating
        res.status(201).json({ message: 'Page added successfully', game: updatedGame });
    } catch (error) {
        console.error('Error adding page to game:', error);
        res.status(500).json({ message: 'Error adding page to game' });
    }
};