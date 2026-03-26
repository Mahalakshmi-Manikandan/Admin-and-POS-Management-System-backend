import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js'; // Make sure this is correct

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
    // Removed unique:true to avoid Sequelize auto-creating an index
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});
  
export default User;
