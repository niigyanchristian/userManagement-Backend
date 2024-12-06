import User from './User';
import Organization from './Organization';
import UserOrganization from './UserOrganization';
import MagicLink from './MagicLink';
import Post from './Post';

export default function associateModels() {
    User.belongsToMany(Organization, { through: UserOrganization, foreignKey: 'user_id' });

    Organization.belongsToMany(User, { through: UserOrganization, foreignKey: 'organization_id' });

    MagicLink.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    Post.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
}
