module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Stock, { foreignKey: "product_id" });
    Product.hasMany(models.PurchaseRequestItem, { foreignKey: "product_id" });
  };

  return Product;
};
