module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("Warehouse", {
    name: DataTypes.STRING,
  });

  Warehouse.associate = (models) => {
    Warehouse.hasMany(models.Stock, { foreignKey: "warehouse_id" });
    Warehouse.hasMany(models.PurchaseRequest, { foreignKey: "warehouse_id" });
  };

  return Warehouse;
};
