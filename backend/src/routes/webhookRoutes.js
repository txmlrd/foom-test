const express = require("express");
const router = express.Router();
const controller = require("../controllers/webhookController");

router.post("/receive-stock", controller.receiveStock);

module.exports = router;
