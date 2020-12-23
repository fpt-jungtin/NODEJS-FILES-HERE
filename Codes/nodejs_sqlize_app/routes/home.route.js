const express = require("express");
const router = express.Router();
const { numberFormatter, moneyFormatter } = global.import("./helpers/formatter");

const courses = [
	{
		id: 1,
		title: "2020 Complete Python Bootcamp From Zero to Hero in Python",
		author: "Jose Portilla",
		imageUrl:
			"https://img-a.udemycdn.com/course/240x135/567828_67d0.jpg?kGjksA8KLjb0_lZIu94F0N3jtWyLC0bZOHgrcq6Ouqhoa-zWvq8qlEMfAbFGVTonilgFDmhOjHvwG6-G5DWHL-BWH5gOd-l0O15BIcyI50dV1rl4wttU-E9b8oTK",
		rating: 4.7,
		studentCount: numberFormatter(205787),
		price: moneyFormatter(129),
	},
	{
		id: 2,
		title: "The Complete 2020 Web Development Bootcamp",
		author: "Dr. Angela Yu",
		imageUrl:
			"https://img-a.udemycdn.com/course/240x135/1565838_e54e_12.jpg?VvdEbk8n6aUdNWPZ-fb4S12_chcukyD-aFbdHvTLJwlXr1PWZdAo1X_J9McAaRB00ffPjmQSWx4qAuHm6jBdzqURjXqKLAJJyjvfC0pT6-Ww7QqXyc82HXuzmmMxtkstAg",
		rating: 4.7,
		studentCount: numberFormatter(104765),
		price: moneyFormatter(129),
	},
	{
		id: 3,
		title: "Microsoft Excel - Advanced Excel Formulas & Functions",
		author: "Maven Analytics, Chris Dutton",
		imageUrl:
			"https://img-a.udemycdn.com/course/240x135/516446_4935_4.jpg?Y2QXh9hH-N4JhAp2A3XmXMtwg12oTxlXozDnzwzbMYuuBhtBDi34abMVhzWYJyvHFf_0K4a8yHU7xxVOpSbBpfTwOUOILe196Gp69ef7CvJAKJjw4GB0_-bZwM08_hY",
		rating: 4.6,
		studentCount: numberFormatter(43100),
		price: moneyFormatter(129),
	},
];

router.get("/", (req, res) => {
	res.render("home", {
		courses,
	});
});

module.exports = router;
