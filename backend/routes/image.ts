import express from 'express';
import { getImages, saveImage } from '../controllers/image';

const router = express.Router();

// @route   POST /api/image/
// @desc    save image
// @access  Public
router.post('/', saveImage);
router.get('/', getImages);

export default router;
