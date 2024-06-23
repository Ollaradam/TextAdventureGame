import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import educatorRoutes from './routes/educator_routes.mjs';
import adventuresRoutes from './routes/adventures_routes.mjs';
import transcriptRoutes from './routes/transcript_routes.mjs'
import cookieParser from 'cookie-parser';
import './passport.mjs';
import fs from 'fs';
import https from 'https';
import getFrontendUrl from './middleware/getFrontendUrl.mjs';

const PORT = 3001;
const app = express();

const mongoURI = "mongodb+srv://adam:zydLJNZ86Ppkbz4B@textadventurecluster.fpuqlbf.mongodb.net/TextAdventures?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

app.use(express.json());
const corsOptions = {
  origin: getFrontendUrl(),
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));

let privateKey, certificate, credentials;

if (getFrontendUrl() == 'http://localhost:3000') {
  app.use(session({
    secret: 'testing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
  }));
} else {
  privateKey = fs.readFileSync('/etc/letsencrypt/live/textadventuregameforeducation.online/privkey.pem', 'utf8');
  certificate = fs.readFileSync('/etc/letsencrypt/live/textadventuregameforeducation.online/fullchain.pem', 'utf8');
  credentials = { key: privateKey, cert: certificate };
  app.use(session({
    secret: 'testing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, sameSite: 'Lax' }
  }));
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/educator', educatorRoutes);
app.use('/games', adventuresRoutes);
app.use('/transcripts', transcriptRoutes);

if (credentials) {
  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server listening on port ${PORT} with SSL...`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}
