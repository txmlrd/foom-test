"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        id: 1,
        name: "Icy Mint",
        sku: "ICYMINT",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Icy Watermelon",
        sku: "ICYWATERMELON",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  }
};
