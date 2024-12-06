import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { CustomError } from '../utils/CustomError';
import { removeUser } from '../services/userService';
import { generateCode } from '../utils';


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body;

        const existtingUser = await User.findOne({ where: { email } });
        if (existtingUser) throw new CustomError("User with this email already exist!", 409);

        const user = await User.create({ email, name, passCode: generateCode() });

        res.status(201).json({ user, success: true });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['accesstoken', 'refreshtoken'] },
        });

        res.status(200).json({ users, success: true });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['accesstoken', 'refreshtoken'] },
        });
        if (!user) throw new CustomError('User not found', 404);
        res.status(200).json({ user, success: true });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['accesstoken', 'refreshtoken'] },
        });
        if (!user) throw new CustomError('User not found', 404);

        const { phone_number } = req.body;
        await user.update({ email: user.email, phone_number });
        res.status(200).json({ user, success: true });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await removeUser({ user_id: req.params.id });
        res.status(200).json({ user, success: true });
    } catch (error) {
        next(error);
    }
};