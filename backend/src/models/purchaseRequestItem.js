module.exports = (sequelize, DataTypes) => {
  const PurchaseRequestItem = sequelize.define("PurchaseRequestItem", {
    quantity: DataTypes.INTEGER,
  });

  PurchaseRequestItem.associate = (models) => {
    PurchaseRequestItem.belongsTo(models.PurchaseRequest, { foreignKey: "purchase_request_id" });
    PurchaseRequestItem.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return PurchaseRequestItem;
};
