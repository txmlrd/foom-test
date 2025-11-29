const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseRequestController");

router.post("/request", controller.createPurchaseRequest);
router.get("/request/:id", controller.getPurchaseRequestById);
router.put("/request/:id", controller.updatePurchaseRequest);
router.delete("/request/:id", controller.deletePurchaseRequest);
router.get("/", controller.getAllPurchaseRequests);

module.exports = router;
