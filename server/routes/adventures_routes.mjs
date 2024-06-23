// routes/adventures_routes.mjs
import express from 'express';
import { upload } from '../middleware/uploadMiddleware.mjs';
import { 
  createGame, 
  findAllGames, 
  findGameById, 
  updateGame, 
  deleteGame, 
  addPageToGame,
  checkClassCode, 
} from '../controllers/adventures_controller.mjs';
import passport from 'passport';

const router = express.Router();

// Setup the routes
router.post('/', upload.single('image'), createGame);
router.get('/', findAllGames);
router.get('/:_id', findGameById);
router.put('/:_id', upload.single('image'), updateGame);
router.delete('/:_id', deleteGame);
router.post('/:_id/pages', addPageToGame);
router.post('/checkClassCode', checkClassCode);

export default router;
