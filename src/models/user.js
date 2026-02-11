'use strict';

const { hashPassword } = require('../utils/bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty"
        },
        notNull: {
          msg: "Name is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address"
        },
        notEmpty: {
          msg: "Email cannot be empty"
        },
        notNull: {
          msg: "Email is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty"
        },
        notNull: {
          msg: "Password is required"
        },
        len: {
          args: [6],
          msg: "Password must be at least 6 characters long"
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      allowNull: false,
      defaultValue: 'customer'

    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://img.myloview.com/murals/default-avatar-profile-icon-vector-social-media-user-symbol-image-700-244492311.jpg',
      validate: {
        notEmpty: {
          msg: "Profile image cannot be empty"
        },
        notNull: {
          msg: "Profile image is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password);
      },

      beforeUpdate: (user) => {
        if (user.changed('password')) {
          user.password = hashPassword(user.password);
        }
      }
    }
  });
  return User;
};