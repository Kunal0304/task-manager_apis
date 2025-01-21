'use strict';
const {
  Model, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, 
      primaryKey: true, 
      allowNull: false
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false, 
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    passWord: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: true, 
    }
  }, {
    sequelize,
    modelName: 'user',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'  
  });
  return user;
};
