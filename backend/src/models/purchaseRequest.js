module.exports = (sequelize, DataTypes) => {
  const PurchaseRequest = sequelize.define("PurchaseRequest", {
    reference: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  PurchaseRequest.associate = (models) => {
    PurchaseRequest.belongsTo(models.Warehouse, { foreignKey: "warehouse_id" });
    PurchaseRequest.hasMany(models.PurchaseRequestItem, {
      foreignKey: "purchase_request_id",
    });
  };

  return PurchaseRequest;
};
