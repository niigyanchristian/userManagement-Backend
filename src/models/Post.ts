import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organization';

class Post extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public organization_id!: number;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        organization_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Organization, key: 'id' },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: false,
    }
);

export default Post;
