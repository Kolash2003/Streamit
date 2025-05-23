import express from 'express';
import { loginController, logoutController, onBoard, signupController } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../utils/isauthenticated.js';


const router = express.Router();

router.post("/login", loginController);
router.post('/logout', logoutController);
router.post('/signup', signupController);

router.post("/onboarding", isAuthenticated, onBoard);


export default router;