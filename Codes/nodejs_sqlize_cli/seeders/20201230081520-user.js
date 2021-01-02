"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("users", [
			{
				email: "test1@gmail.com",
				password: "123456",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				email: "test2@gmail.com",
				password: "123456",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {},
};
