import { NextFunction, Request, Response } from 'express';
import { createPost, deletePost, findPostById, findPosts, updatePost } from '../services/postService';
import { AuthRequest } from '../types/interfaces';
import { authorizeManager } from '../utils';


export const createPostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { title, description, organization_id } = req.body;

        if (user?.role == 'User') {
            await authorizeManager({ organization_id, user });
        }

        const post = await createPost({ title, description, organization_id });

        res.status(201).json({ post, success: true });
    } catch (error) {
        next(error);
    }
};

export const getPostRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organization_id } = req.params;
        const posts = await findPosts({ organization_id });

        res.status(200).json({ posts, success: true });
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const post = await findPostById({ id: parseInt(id) });

        res.status(200).json({ post, success: true });
    } catch (error) {
        next(error);
    }
};

export const updatePostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { id, } = req.params;
        const { title, description } = req.body;

        const oldpost = await findPostById({ id: parseInt(id) });

        if (user?.role == 'User') {
            await authorizeManager({ organization_id: oldpost.organization_id, user });
        }

        const post = await updatePost({ id: parseInt(id), title, description });

        res.status(200).json({ post, success: true });
    } catch (error) {
        next(error);
    }
};

export const deletePostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const oldpost = await findPostById({ id: parseInt(id) });

        if (user?.role == 'User') {
            await authorizeManager({ organization_id: oldpost.organization_id, user });
        }
        const post = await deletePost({ id: parseInt(id) });

        res.status(200).json({ post, success: true });
    } catch (error) {
        next(error);
    }
};