import { Request } from 'express';
import { DataTypes, Model } from 'sequelize';

export interface UserAttributes {
    id: number;
    email: string;
    phone_number: string;
    password_hash: string;
    createdAt?: Date;
    updatedAt?: Date;
}



export interface RoleAttributes {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

enum Role {
    Admin = 'Admin',
    User = 'User',
}


export interface IUser {
    id: number;
    email: string;
    passCode: number;
    accesstoken: string;
    refreshtoken: string;
    phone_number: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export interface Organization {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserOrganization {
    id: number;
    user_id: number;
    organization_id: number;
    role: Role;
    active: boolean;
    joined_at: Date;
}

export interface OrganizationWithUserOrganization extends Organization {
    UserOrganization?: UserOrganization;
}