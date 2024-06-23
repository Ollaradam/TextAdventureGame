// server/adventures_controller.mjs

// THIS FILE IS DEPRECATED AND WILL BE REMOVED IN A FUTURE UPDATE

/*
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as games from './models/adventures_model.mjs';
import session from 'express-session';
import passport from 'passport';
import JWT from 'jsonwebtoken';
import { findGameByClassCode } from './models/adventures_model.mjs'

const PORT = 3001;
const app = express();

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions));
app.use(session({
  secret: 'testing',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}))
app.use(passport.initialize());
app.use(passport.session());

const generateUniqueClassCode = async () => {
    let classCode;
    // do {
    classCode = generateClassCode();
    // } while (Game.findOne({ class_code }));
    return classCode;
};

const generateClassCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file storage
const uploadDir = path.join(__dirname, '/uploads');
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));


// Create a new game
app.post('/games', upload.single('image'), async (req, res) => {
    const classCode = await generateUniqueClassCode();
    const { game_id, title, description, author, pages } = req.body;

    let imageBase64 = null;
    if (req.file) {
        // Convert the image to a Base64 string
        const imgBuffer = fs.readFileSync(req.file.path);
        imageBase64 = imgBuffer.toString('base64');
    }

    // Assuming your createGame function can accept a Base64 string for the image
    games.createGame(classCode, title, description, author, pages, imageBase64)
        .then(game => {
            // Optionally delete the file after conversion if you're still using multer for file handling
            if (req.file) fs.unlinkSync(req.file.path);

            res.status(201).json(game);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error creating new game' });
        });
});


// Return array of all games
app.get('/games', (req, res) => {
    games.findAllGames()
        .then(games => {
            res.json(games);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Failed to fetch games' });
        });
});

// Get a game by ID
app.get('/games/:game_id', (req, res) => {
    games.findGameById(req.params.game_id)
        .then(game => {
            if (game) {
                res.json(game);
            } else {
                res.status(404).json({ Error: 'Game not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});


//Student Login
app.post('/studentlogin', async (req, res) => {
    
    const {code} = req.body;


    console.log("Student logging in");
    console.log({code})

//     const existingGame = await games.findOne({ code: code });
    
//     // console.log(existingGame);
    
//     if (existingGame) {
//         console.log("Existing Game!");
//         return res.status(201).json({ success: true, existingGame});
//     }

//     else
//     {
//         console.log("Failure");
//         res.status(401).json({ success: false});
//     }
});
    


    



// Update a game
app.put('/games/:game_id', upload.single('image'), (req, res) => {
    const { title, description, author, pages } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined; // undefined indicates no new image uploaded

    games.updateGame(req.params.game_id, title, description, author, pages, image)
        .then(updatedGame => {
            if (updatedGame) {
                res.json(updatedGame);
            } else {
                res.status(404).json({ Error: 'Game not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});


// Delete a game
app.delete('/games/:game_id', (req, res) => {
    games.deleteGame(req.params.game_id)
        .then(deletedCount => {
            if (deletedCount) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Game not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});


// Endpoint to add a page to a game
app.post('/games/:game_id/pages', async (req, res) => {
    const { page_id, content, question, choices, image } = req.body;

    try {
        // Find the game by ID
        const game = await games.Game.findOne({ game_id });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Decode the Base64-encoded image data
        const imageBuffer = Buffer.from(image, 'base64');
        const imageBase64 = imageBuffer.toString('base64');

        // Construct the new page object based on your page schema
        const newPage = new games.Page({ page_id, content, question, choices, image: imageBase64 });

        // Push the new page to the game's pages array
        game.pages.push(newPage);

        // Save the updated game document
        await game.save();

        res.status(201).json({ message: 'Page added successfully', game });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding page to game' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
*/