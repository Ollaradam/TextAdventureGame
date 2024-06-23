// models/adventures_model.mjs
import mongoose from 'mongoose';
import Educator from './educator_model.mjs';
const { Schema } = mongoose;



const choiceSchema = mongoose.Schema({
    text: { type: String, required: false }, // Make text optional
    isCorrect: { type: Boolean, default: false }, // Keep as is, default to false
    pageNav: { type: String, required: false }
});

const pageSchema = mongoose.Schema({
    page_id: { type: String, required: true },
    content: { type: String, required: true },
    question: { type: String, required: false }, // Make question optional
    choices: { type: [choiceSchema], required: false }, // Choices themselves can be optional
    image: { type: String, required: false }  // Optional image URL for pages
});


const gameSchema = mongoose.Schema({
    class_code: {type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: [pageSchema], required: true },
    educator: { type: Schema.Types.ObjectId, ref: 'Educator', required: true },
    image: { type: String, required: false }  // Optional image URL for games
});

const Game = mongoose.model("Game", gameSchema, 'Adventures');

const findAllGames = async () => {
    try {
        const games = await Game.find({});
        return games;
    } catch (error) {
        console.error("Failed to find games:", error);
        throw error;
    }
};

const findGamesByEducator = async (educatorId) => {
    try {
        const games = await Game.find({ educator: educatorId });
        return games;
    } catch (error) {
        console.error("Failed to find games by educator:", error);
        throw error;
    }
};

const createGame = async (classCode, title, description, author, pages, educator, image) => {
    try {
        const newGame = new Game({ class_code: classCode, title, description, author, pages, educator, image });
        await newGame.save();
        return newGame;
    } catch (error) {
        console.error("Failed to create game:", error);
        throw error;
    }
};

const findGameById = async (_id) => {
    return await Game.findById(_id);
};

const findGameByClassCode = async (class_code) => {
    return await Game.findOne({ class_code });
};

const updateGame = async (_id, updateData) => {
    try {
        if ('image' in updateData && !updateData.image) {
            delete updateData.image;
        }

        const updatedGame = await Game.findByIdAndUpdate(_id, updateData, { new: true });
        return updatedGame;
    } catch (error) {
        console.error("Failed to update game:", error);
        throw error;
    }
};

const deleteGame = async (_id) => {
    try {
        const game = await Game.findById(_id).populate('educator');
        
        if (!game) {
            console.log(`No game found with ID. ${_id}`)
            return { deletedCount: 0, message: "No game found with that ID." };  // No game found
        }

        const result = await Game.deleteOne({ _id });
        if (result.deletedCount > 0) {
            // Remove the game from the educator's adventures list
            await Educator.findByIdAndUpdate(game.educator, {
                $pull: { adventures: _id }
            });
        }

        return { deletedCount: result.deletedCount, message: "Game deleted successfully." };
    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
};

// Export the functions for use in the controller
export { Game, findAllGames, createGame, findGameById, findGameByClassCode, updateGame, deleteGame, findGamesByEducator };
export default mongoose.model('Game', gameSchema);