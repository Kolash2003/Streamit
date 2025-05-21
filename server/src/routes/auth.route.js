import express from 'express';
import { loginController, logoutController, signupController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/login", loginController);
router.post('/logout', logoutController);
router.post('/signup', signupController);


export default router;