const Sequelize = require("sequelize");

const db = new Sequelize("learn_sqlize", "hbstudent", "hbstudent", {
	dialect: "mysql",
	host: "localhost",
});

module.exports = db;
