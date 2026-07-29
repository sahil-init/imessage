import express from 'express';

import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getConversationsForSidebar,
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from '../controllers/message.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/users', getUsersForSidebar);
router.get('/conversations', getConversationsForSidebar);
router.get('/:id', getMessages);
router.post('/:id', upload.single('media'), sendMessage);
// todo: show this in the frontend part

export default router;
