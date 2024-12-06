import Organization from "../models/Organization";
import UserOrganization from "../models/UserOrganization";
import { CustomError } from "../utils/CustomError";


export const findOrgById = async ({ organization_id }: { organization_id: number }) => {

    const organization = await Organization.findByPk(organization_id);

    if (!organization) throw new CustomError('Organization not found', 404);

    return organization;
}

export const removeUserFromOrg = async ({ organizationId, userId }: { organizationId: string, userId: string }): Promise<any> => {
    try {
        const userOrganization = await UserOrganization.findOne({ where: { user_id: userId, organization_id: organizationId } });

        if (!userOrganization) throw new CustomError('User not part of this organization', 404);

        await userOrganization.destroy();

        return userOrganization;
    } catch (error) {
        throw new CustomError(error as string, 500);
    }
}


export const getUserOrg = async ({ organization_id }: { organization_id: number }) => {
    const userOrganization = await UserOrganization.findAll({ where: { organization_id: organization_id } });

    if (!userOrganization) throw new CustomError('User\'s organization not found', 404);

    return userOrganization.map((item) => item.dataValues);
}