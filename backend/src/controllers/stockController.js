const { Stock, Product, Warehouse } = require("../models");
const { Op } = require("sequelize");

exports.getAllStocks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { "$Product.name$": { [Op.iLike]: `%${search}%` } },
        { "$Warehouse.name$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const stocks = await Stock.findAndCountAll({
      distinct: true, 
      col: "id",
      where,
      include: [
        { model: Product, attributes: ["id", "name", "sku"] },
        { model: Warehouse, attributes: ["id", "name"] },
      ],
      offset,
      limit: parseInt(limit),
      order: [["product_id", "ASC"]],
    });

    res.json({
      status: "success",
      page: parseInt(page),
      totalPages: Math.ceil(stocks.count / limit),
      data: stocks.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
