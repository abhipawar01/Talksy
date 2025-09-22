import express from 'express';
import { registerUser, loginUser, getUser, getPublishedImags } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/getuser', protect, getUser);
userRouter.get('/published-images', getPublishedImags)

export default userRouter;

