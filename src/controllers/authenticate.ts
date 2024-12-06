import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/userService';
import { AuthRequest } from '../types/interfaces';
import { CustomError } from '../utils/CustomError';
import { generateCode } from '../utils';
import UserOrganization from '../models/UserOrganization';

export const Login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { passcode } = req.body;
    const user_id = req.user?.id;
    try {
        if (!user_id) throw new CustomError("Not Authorized", 401);
        const user = await getUserById({ user_id });
        if (user.passCode != passcode) {
            throw new CustomError("Wrong credential", 401);
        }

        const accesstoken = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        await user.update({ accesstoken, passCode: generateCode() });

        const userData = await getUserById({ user_id });
        const userOrg = await UserOrganization.findAll({ where: { user_id: user_id } });

        res.status(200).json({ data: { userOrg: userOrg, ...userData.dataValues }, accesstoken });
    } catch (error) {
        next(error);
    }
}
