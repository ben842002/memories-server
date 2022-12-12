import express from 'express';
import auth from '../middleware/auth.js';

// import route callback functions
import { getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';

// A note on this file structure. Having the controllers folder
// makes for clean and scalable structure and hierarchy.

const router = express.Router();

router.get('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;