import User from "../models/User";
import { CustomError } from "../utils/CustomError";

export const getUserById = async ({ user_id }: { user_id: number }) => {

    const user = await User.findByPk(user_id, {
        attributes: { exclude: ['accesstoken', 'refreshtoken'] },
    });

    if (!user) throw new CustomError('User not found', 404);
    return user;
}

export const removeUser = async ({ user_id }: { user_id: string }): Promise<any> => {
    try {
        const user = await User.findByPk(user_id, {
            attributes: { exclude: ['accesstoken', 'refreshtoken'] },
        });
        if (!user) throw new CustomError('User not found', 404);

        await user.destroy();

        return user;
    } catch (error) {
        throw new CustomError(error as string, 500);
    }
}