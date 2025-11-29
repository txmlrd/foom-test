module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stock", {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });

  Stock.associate = (models) => {
    Stock.belongsTo(models.Product, { foreignKey: "product_id" });
    Stock.belongsTo(models.Warehouse, { foreignKey: "warehouse_id" });
  };

  return Stock;
};
