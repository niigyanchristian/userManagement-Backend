import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

enum Role {
    User = 'Viewer',
    Manager = 'Manager',
}
class UserOrganization extends Model {
    public id!: number;
    public user_id!: number;
    public organization_id!: number;
    public role!: Role;
    public active!: boolean;
    public joined_at!: Date;
}


UserOrganization.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        organization_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'organizations', key: 'id' },
            onDelete: 'CASCADE',
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Role)),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        joined_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'UserOrganization',
        tableName: 'user_organizations',
        timestamps: false,
    }
);

export default UserOrganization;
