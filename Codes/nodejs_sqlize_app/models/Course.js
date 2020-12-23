const { DataTypes, Model } = require("sequelize");
const db = global.import("./config/database");

const Course = db.define("course", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	author: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	imageUrl: {
		type: DataTypes.STRING,
	},
	rating: {
		type: DataTypes.TINYINT,
	},
	studentCount: DataTypes.INTEGER,
	price: {
		type: DataTypes.DECIMAL,
		allowNull: false,
	},
});

module.exports = Course;
