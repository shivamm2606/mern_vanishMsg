import express from 'express';
import { createSecret, getSecret } from '../controllers/secretController.js';
import { validateSecret } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validateSecret, createSecret);

router.get('/:id', getSecret);

export default router;
