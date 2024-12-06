import jwt from 'jsonwebtoken';
import MagicLink from '../models/MagicLink';

export const createMagicLink = async (user_id: number): Promise<string> => {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await MagicLink.update(
        { status: 'revoked' },
        { where: { user_id, status: 'active' } }
    );

    await MagicLink.create({
        token,
        user_id,
        expiresAt,
        used: false,
        status: 'active',
    });


    return token;
};
