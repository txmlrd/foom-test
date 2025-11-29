const service = require("../services/purchaseRequestService");

exports.getPurchaseRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    const raw = await service.getPurchaseRequestById(id);

    // console.log(raw);

    const simplified = {
      id: raw.id,
      reference: raw.reference,
      status: raw.status,
      warehouse_id: raw.warehouse_id,
      warehouse_name: raw.Warehouse.name,
      createdAt: raw.createdAt,
      items: raw.PurchaseRequestItems.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        product_id: i.product_id,
        product_name: i.Product.name,
        sku: i.Product.sku,
      })),
    };

    res.json({ status: "success", data: simplified });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPurchaseRequests = async (req, res) => {
  try {
    const query = req.query;
    const result = await service.getAllPurchaseRequests(query);
    res.json({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPurchaseRequest = async (req, res) => {
  try {
    const { warehouse_id, items } = req.body;

    if (!warehouse_id || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    //check warehouse_id 
    const warehouseExists = await service.checkWarehouseExists(warehouse_id);
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id" });
    }

    //check product_id 
    for (const item of items) {
      const productExists = await service.checkProductExists(item.product_id);
      if (!productExists) {
        return res.status(400).json({ message: `Invalid product_id: ${item.product_id}` });
      }
    }

    const result = await service.createPurchaseRequest({ warehouse_id, items });
    console.log(result);
    res.json({
      status: "success",
      message: "Purchase Request created",
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePurchaseRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    const result = await service.updatePurchaseRequest(id, payload);

    res.json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.deletePurchaseRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await service.deletePurchaseRequest(id);

    res.json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
