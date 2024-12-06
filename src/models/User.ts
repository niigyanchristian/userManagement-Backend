import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { IUser } from '../types/interfaces';

enum Role {
    Admin = 'Admin',
    User = 'User',
}

export class User extends Model implements IUser {
    public id!: number;
    public name!: string;
    public email!: string;
    public passCode!: number;
    public accesstoken!: string;
    public refreshtoken!: string;
    public phone_number!: string;
    public role!: Role;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passCode: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Role)),
            allowNull: false,
            defaultValue: 'User'
        },
        accesstoken: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        refreshtoken: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    }
);

export default User;
