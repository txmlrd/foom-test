const { Warehouse } = require("../models");
const { Op } = require("sequelize");

exports.getAllWarehouses = async (req, res) => {
  try {
    const search = req.query.search || "";

    const where = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const result = await Warehouse.findAndCountAll({
      distinct: true,
      col: "id",
      where,
      order: [["name", "ASC"]],
    });

    res.json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
