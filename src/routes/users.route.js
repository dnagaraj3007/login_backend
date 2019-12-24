import express from 'express';
import {auth} from '../middleware/auth';
import users from '../controllers/user.controller.js'


const router = express.Router();
router.get('/', auth, users.test)
router.get('/current', auth, users.getCurrentUser )
router.post('/', users.createNewUser )

export default router;