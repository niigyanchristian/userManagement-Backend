import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import nodemailer from 'nodemailer';

import MagicLink from '../models/MagicLink';
import { CustomError } from '../utils/CustomError';
import { createMagicLink } from '../utils/magicLinkUtils';
import UserOrganization from '../models/UserOrganization';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendMagicLink = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new CustomError('User not found', 404);

        const token = await createMagicLink(user.id);

        const magicLink = `${process.env.BASE_URL}/magic-links/verify/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your Magic Login Link',
            html: `<p>Click the link below to login:</p><a href="${magicLink}">${magicLink}</a>. <p>Use this password: ${user.passCode} to login and After change the is.`
        });

        res.status(200).json({ message: 'Magic link sent successfully' });
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const revokeMagicLink = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, organizationId } = req.body;

    try {
        const magicLink = await MagicLink.findOne({ where: { user_id, status: 'active' } });

        if (!magicLink) {
            throw new CustomError('Magic link not found', 404);
        }

        magicLink.status = 'revoked';
        await magicLink.save();

        res.status(200).json({ message: 'Magic link revoked successfully' });
    } catch (error) {
        next(error);
    }
};


export const verifyMagicLink = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    try {
        const magicLink = await MagicLink.findOne({ where: { token } });

        if (!magicLink) {
            throw new CustomError('Magic link not found', 404);
        }

        if (magicLink.used) {
            throw new CustomError('This magic link has been used', 400);
        }

        if (magicLink.status === 'revoked') {
            throw new CustomError('This magic link has been revoked', 400);
        }

        if (new Date() > magicLink.expiresAt) {
            throw new CustomError('This magic link has expired', 400);
        }

        const { user_id } = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string };

        await MagicLink.update(
            { status: 'revoked', used: true },
            { where: { user_id, status: 'active' } }
        );

        const user = await User.findByPk(user_id);
        if (!user) throw new CustomError('User not found', 404);

        const accesstoken = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET!, { expiresIn: '7m' });
        const refreshtoken = jwt.sign({ user_id: user_id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

        await user.update({ refreshtoken, accesstoken });

        const org = await UserOrganization.findOne({ where: { user_id: user_id } });
        org?.update({ active: true });

        res.redirect(`http://localhost:5173/passcode?accesstoken=${accesstoken}`);
    } catch (error) {
        next(error);
    }
};
