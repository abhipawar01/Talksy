import express from 'express';
import { createChat, getChats, deleteChat } from '../controllers/chatController.js';

import { protect } from '../middlewares/auth.js';


const chatRouter = express.Router();

chatRouter.post('/create',protect,createChat);
chatRouter.get('/getchats',protect,getChats);
chatRouter.post('/deletechat/:chatId',protect,deleteChat);

export default chatRouter;