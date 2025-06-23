import express from 'express';
import { askBot } from '../controllers/chatbotController.js';

const router = express.Router();
router.post('/', askBot);
export default router;
