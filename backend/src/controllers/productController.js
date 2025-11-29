const { Product } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search) {
      where[Symbol.for("or")] = [
        { name: { [require("sequelize").Op.iLike]: `%${search}%` } },
        { sku: { [require("sequelize").Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({ where });

    res.json({
      status: "success",
      data: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
