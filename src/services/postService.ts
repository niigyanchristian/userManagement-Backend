import Post from "../models/Post"
import { CustomError } from "../utils/CustomError";

export const createPost = async ({ title, description, organization_id }: { title: string, description: string, organization_id: number }) => {

    const post = await Post.create({ title, description, organization_id });

    return post;
}

export const findPosts = async ({ organization_id }: { organization_id: string }) => {
    const posts = await Post.findAll({ where: { organization_id } });

    return posts;
}

export const findPostById = async ({ id }: { id: number }) => {
    const post = await Post.findByPk(id);

    return post?.dataValues;
}

export const updatePost = async ({ id, title, description }: { id: number, title: string, description: string }) => {
    const post = await Post.findByPk(id);
    if (!post) throw new CustomError("Post not found", 404);

    await post.update({ title, description });

    return post;
}

export const deletePost = async ({ id }: { id: number }) => {
    const post = await Post.findByPk(id);
    if (!post) throw new CustomError("Post not found", 404);

    await post.destroy()

    return post;
}