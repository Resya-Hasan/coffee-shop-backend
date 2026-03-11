'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  ProductImage.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    imgUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "https://imgs.search.brave.com/v32MO73ybj4I0fNwlWUU6DmFm_UOsMXyRoOchwBNI7s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGFj/ZWhvbGQubmV0L3By/b2R1Y3Quc3Zn"
    }
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};