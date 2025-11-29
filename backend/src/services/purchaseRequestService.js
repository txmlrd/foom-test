const axios = require("axios");
const { PurchaseRequest, PurchaseRequestItem, Product, Warehouse, sequelize } = require("../models");
const { generateReference } = require("../utils/referenceGenerator");

exports.getPurchaseRequestById = async (id) => {
  const pr = await PurchaseRequest.findOne({
    where: { id },
    include: [
      {
        model: PurchaseRequestItem,
        include: [Product],
      },
      {
        model: Warehouse,
        attributes: ["id", "name"],
      },
    ],
  });

  return pr;
};

// CHECK WAREHOUSR DATA DAN PRODUCT START
exports.checkWarehouseExists = async (warehouse_id) => {
  const warehouse = await Warehouse.findByPk(warehouse_id);
  return !!warehouse;
};

exports.checkProductExists = async (product_id) => {
  const product = await Product.findByPk(product_id);
  return !!product;
};
// CHECK WAREHOUSR DATA DAN PRODUCT END

exports.createPurchaseRequest = async (payload) => {
  const { warehouse_id, items } = payload;
  const reference = await generateReference();

  return await sequelize.transaction(async (t) => {
    // new pr with draft
    const pr = await PurchaseRequest.create(
      {
        reference,
        warehouse_id,
        status: "DRAFT",
      },
      { transaction: t }
    );


    for (const item of items) {
      await PurchaseRequestItem.create(
        {
          purchase_request_id: pr.id,
          product_id: item.product_id,
          quantity: item.quantity,
        },
        { transaction: t }
      );
    }

    return {
      message: "Purchase Request created",
      data: pr,
    };
  });
};

exports.updatePurchaseRequest = async (id, payload) => {
  const pr = await PurchaseRequest.findOne({
    where: { id },
    include: [
      {
        model: PurchaseRequestItem,
        include: [Product],
      },
    ],
  });

  if (!pr) throw new Error("Purchase request not found");
  console.log("📝 Current PR status:", pr.status);

  //check status payload -> matching send ke vendor di fe
  if (payload.status && !["DRAFT", "PENDING"].includes(payload.status)) {
    throw new Error("Invalid status value");
  }

  // draft only can update
  if (pr.status !== "DRAFT") {
    throw new Error("PR with status " + pr.status + " cannot be updated");
  }
  // update fields
  if (payload.reference) pr.reference = payload.reference;
  if (payload.warehouse_id) pr.warehouse_id = payload.warehouse_id;


  if (payload.items) {
    // Remove old items
    await PurchaseRequestItem.destroy({
      where: { purchase_request_id: pr.id },
    });

    // Insert new items
    for (const item of payload.items) {
      await PurchaseRequestItem.create({
        purchase_request_id: pr.id,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }
  }

  // If UPDATE TO PENDING → trigger vendor API
  if (payload.status === "PENDING") {
    pr.status = "PENDING";

    const vendorPayload = buildVendorPayload(pr);

    // console.log(vendorPayload);

    try {
      await axios.post(process.env.VENDOR_API_URL, vendorPayload, {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.FOOM_SECRET_KEY,
        },
      });
    } catch (err) {
      throw new Error("Failed to send to vendor: " + err.message);
    }
  }

  await pr.save();

  return {
    message: "Purchase Request updated successfully",
    data: pr,
  };
};

exports.deletePurchaseRequest = async (id) => {
  const pr = await PurchaseRequest.findByPk(id);
  if (!pr) throw new Error("Purchase Request not found");

  if (pr.status !== "DRAFT") {
    throw new Error(`PurchaseRequests with status ${pr.status} cannot be deleted`);
  }

  await PurchaseRequestItem.destroy({
    where: { purchase_request_id: id },
  });

  await pr.destroy();

  return {
    message: `Purchase Request ${id} deleted`,
  };
};

// PAGINATION & SEARCH
exports.getAllPurchaseRequests = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const search = query.search || "";
  const status = query.status || "";
  const { Op } = require("sequelize");

  const where = {};

  if (search) {
    where.reference = { [Op.iLike]: `%${search}%` };
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  const data = await PurchaseRequest.findAndCountAll({
    distinct: true,
    col: "id",
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{ model: PurchaseRequestItem, include: [Product] }, Warehouse],
  });

    const mappedData = data.rows.map((pr) => {
    const quantity_total = pr.PurchaseRequestItems?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

    return {
      ...pr.toJSON(),
      quantity_total,
    };
  });

  return {
    page,
    total_pages: Math.ceil(data.count / limit),
    total_data: data.count,
    data: mappedData,
  };
};

// Vendor payload builder
function buildVendorPayload(pr) {
  return {
    vendor: "PT FOOM LAB GLOBAL",
    reference: pr.reference,
    qty_total: pr.PurchaseRequestItems.reduce((sum, x) => sum + x.quantity, 0),
    details: pr.PurchaseRequestItems.map((item) => ({
      product_name: item.Product.name,
      sku_barcode: item.Product.sku,
      qty: item.quantity,
    })),
  };
}
