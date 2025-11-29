"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PurchaseRequests", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Warehouses",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM("DRAFT", "PENDING", "COMPLETED"),
        allowNull: false,
        defaultValue: "DRAFT"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("PurchaseRequests");
  }
};
