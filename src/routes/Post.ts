import express from 'express';
import { createPostRequest, deletePostRequest, getPostById, getPostRequest, updatePostRequest } from '../controllers/Post';

const router = express.Router();

router.post('/', createPostRequest);

router.get('/org/:organization_id', getPostRequest);

router.route('/:id').
    get(getPostById).
    put(updatePostRequest).
    delete(deletePostRequest);


export default router;
