const { PurchaseRequest } = require("../models");

exports.generateReference = async () => {
  const lastRecord = await PurchaseRequest.findOne({
    order: [["id", "DESC"]],
  });

  const nextNumber = lastRecord ? lastRecord.id + 1 : 1;

  return `PR${String(nextNumber).padStart(5, "0")}`;
};
