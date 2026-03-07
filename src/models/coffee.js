'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coffee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Coffee.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Coffee.hasMany(models.CoffeeImage, { foreignKey: 'coffeeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }
  Coffee.init({
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
        len: {
          args: [3, 100],
          msg: "Name must be between 3 and 100 characters long"
        },
        notNull: {
          msg: "Name is required"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description cannot be empty"
        },
        notNull: {
          msg: "Description is required"
        }
      }
    },
    productInformation: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product information cannot be empty"
        },
        notNull: {
          msg: "Product information is required"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Price must be an integer"
        },
        min: {
          args: [0],
          msg: "Price must be a positive number"
        },
        notNull: {
          msg: "Price is required"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: "Stock must be an integer"
        },
        min: {
          args: [0],
          msg: "Stock must be a non-negative number"
        },
        notNull: {
          msg: "Stock is required"
        }
      }
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Sold must be an integer"
        },
        min: {
          args: [0],
          msg: "Sold must be a non-negative number"
        },
        notNull: {
          msg: "Sold is required"
        }
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category ID is required"
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Slug cannot be empty"
        },
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: "Slug must be lowercase and can only contain letters, numbers, and hyphens"
        },
        notNull: {
          msg: "Slug is required"
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        notNull: {
          msg: "isActive is required"
        }
      }
    },
    image: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Coffee',
  });
  return Coffee;
};