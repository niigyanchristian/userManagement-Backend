import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Organization extends Model {
    public id!: number;
    public name!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Organization.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'Organization',
        tableName: 'organizations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Organization;
