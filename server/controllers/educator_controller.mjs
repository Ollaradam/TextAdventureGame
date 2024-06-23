// server/controllers/educator_controller.mjs
import Educator from '../models/educator_model.mjs';
import passport from 'passport';
import JWT from 'jsonwebtoken';

// Create a new educator
export const createEducator = async (req, res) => {
    try {
        const { name } = req.body;
        const existingEducator = await Educator.findOne({ name });

        if (existingEducator) {
            return res.status(400).json({ success: false, error: 'Educator with this name already exists' });
        }

        const educator = new Educator(req.body);
        await educator.save();
        res.status(201).json({ success: true, educator });
    } catch (error) {
        console.error('Error creating educator:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getEducatorAdventures = async (req, res) => {
    try {
        const educatorId = req.user._id;
        console.log("PRINTING ID");
        console.log(`educatorId: ${req.user.id}`);
        const educator = await Educator.findById(educatorId).populate('adventures');
        if (!educator) {
            return res.status(404).json({ message: 'Educator not found' });
        }
        console.log(educator.adventures)
        res.json(educator.adventures);
    } catch (error) {
        console.error('Error fetching educator adventures:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};



// Handle educator login
export const loginEducator = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Login failed' });
        }
        req.logIn(user, err => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            console.log("LOGGED IN SUCCESSFULLY")
            return res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email } });
        });
    })(req, res, next);
};

// Check if the educator is authenticated
export const checkAuthenticated = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ status: 'success', message: 'You are authenticated' });
    } else {
        res.status(401).json({ status: 'error', message: 'You are not authenticated' });
    }
};

// Create session for authenticated educator
export const createSession = async (req, res) => {
    if(req.isAuthenticated()){
        const { _id, name, email } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { name, email } });
    }
};

// Method to add a game to an educator's list of adventures
export const addGameToEducator = async (educatorId, gameId) => {
    try {
        // Add the game to the educator's list of adventures
        const updatedEducator = await Educator.findByIdAndUpdate(
            educatorId,
            { $addToSet: { adventures: gameId } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated document
        );

        return updatedEducator;
    } catch (error) {
        console.error('Error adding game to educator:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

// Utility function to sign JWT token
const signToken = userId => {
    return JWT.sign(
        {
            iss: "testing",
            sub: userId
        },
        "testing", // This should be replaced with a process.env variable in production
        { expiresIn: "1h" }
    );
};
