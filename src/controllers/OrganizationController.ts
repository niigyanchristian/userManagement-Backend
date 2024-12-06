import { NextFunction, Request, Response } from 'express';
import Organization from '../models/Organization';
import User from '../models/User';
import UserOrganization from '../models/UserOrganization';
import { CustomError } from '../utils/CustomError';
import { removeUserFromOrg } from '../services/organization';
import { removeUser } from '../services/userService';
import MagicLink from '../models/MagicLink';

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const organization = await Organization.create({ name });
        res.status(201).json({ organization, success: true });
    } catch (error) {
        next(error);
    }
};

export const getOrganizations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizations = await Organization.findAll();
        res.status(200).json({ organizations, success: true });
    } catch (error) {
        next(error);
    }
};

export const assignUserToOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId, userId } = req.params;
        const { role } = req.body;

        const organization = await Organization.findByPk(organizationId);
        const user = await User.findByPk(userId);

        if (!organization || !user) throw new CustomError('Organization or User not found', 404);

        const userOrganization = await UserOrganization.create({ user_id: user.id, organization_id: organization.id, role });
        res.status(200).json({ userOrganization, success: true });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId } = req.params;
        const userOrganization = await UserOrganization.findOne({ where: { organization_id: organizationId } });

        if (!userOrganization) throw new CustomError('Organization not found', 404);

        res.status(200).json({ userOrganization, success: true });
    } catch (error) {
        next(error);
    }
};

export const removeUserFromOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId, userId } = req.params;

        const userOrganization = await removeUserFromOrg({ organizationId, userId });

        const magic = await MagicLink.findAll({ where: { user_id: userId } });

        await Promise.all(magic.map(record => record.destroy()));

        await removeUser({ user_id: userId });

        res.status(204).json({ userOrganization, success: true });
    } catch (error) {
        next(error);
    }
};


export const fetchUsersByOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationId } = req.params;
        const users = await User.findAll({
            include: [
                {
                    model: Organization,
                    through: { attributes: ['role', 'active', 'joined_at'] },
                    where: { id: organizationId },
                },
            ],
            attributes: { exclude: ['accesstoken', 'refreshtoken'] }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        next(error)
    }
}
