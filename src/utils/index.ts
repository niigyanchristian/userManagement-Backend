import { findOrgById, getUserOrg } from "../services/organization";
import { IUser } from "../types/interfaces";
import { CustomError } from "./CustomError";

export const generateCode = (): number => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const authorizeManager = async ({ organization_id, user }: { organization_id: number, user: IUser | undefined }) => {
    const organization = await findOrgById({ organization_id });

    if (!organization) throw new CustomError("Organization not found", 404);

    const userOrg = await getUserOrg({ organization_id });
    if (!user) throw new CustomError("User not found", 404);

    const userOrgData = userOrg.find((item) => item.user_id == user.id);

    if (!userOrgData) throw new CustomError("User not assigned to this org!", 409);

    if (userOrgData.role != 'Manager') throw new CustomError("Unauthorized!", 409);

}