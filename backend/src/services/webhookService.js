const { PurchaseRequest, PurchaseRequestItem, Product, Stock, sequelize } = require("../models");

exports.receiveStock = async (payload) => {
  console.log("webhook service", payload);

  const { reference, details, status } = payload;
  
  // cek pr by reference
  const pr = await PurchaseRequest.findOne({
    where: { reference },
    include: [
      {
        model: PurchaseRequestItem,
        include: [Product],
      },
    ],
  });

  // console.log("purchase request", pr);


if (!pr) {
  return {
    error: true,
    code: 404,
    message: `PurchaseRequest with reference '${reference}' not found`
  };
}
  console.log("pr.status", pr.status);
  console.log("pr.reference", pr.reference);

  // idempotency logic requeirement 3 point 2 di logic rules
  if (pr.status === "COMPLETED") {
    return {
      message: "Already processed (idempotent)",
      data: pr,
    };
  }

  return await sequelize.transaction(async (t) => {
    for (const item of details) {
      const sku = item.sku_barcode;
      const qty = item.qty;

      const product = await Product.findOne({ where: { sku } });

      if (!product) throw new Error(`Product with SKU ${sku} not found`);

      let stock = await Stock.findOne({
        where: {
          product_id: product.id,
          warehouse_id: pr.warehouse_id,
        },
      });

      if (!stock) {
        stock = await Stock.create(
          {
            product_id: product.id,
            warehouse_id: pr.warehouse_id,
            quantity: qty,
          },
          { transaction: t }
        );
      } else {
        stock.quantity += qty;
        await stock.save({ transaction: t });
      }

      console.log(`update stock for sku ${sku} (+${qty})`);
    }

    pr.status = "COMPLETED";
    await pr.save({ transaction: t });

    console.log("STOCK UPDATED");

    return {
      message: "Stock updated successfully",
      data: pr,
    };
  });
};
