const service = require("../services/webhookService");

exports.receiveStock = async (req, res) => {
  try {
    console.log("webhook body", req.body);

    const payload = req.body;
    const data = payload;

    const reference = data.reference;
    const status = data.status_request;
    const details = data.details || [];

    const formattedPayload = {
      reference,
      status,
      details
    };

    // console.log("hasil frmated", formattedPayload);

    const result = await service.receiveStock(formattedPayload);
    if (result.error) {
      return res.status(result.code).json({
        status: "error",
        message: result.message
      });
    }
    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data
    });

  } catch (err)  {
    console.log("webhook error", err);

    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};
