const router = require("express").Router();
const { User, Post } = require("../models");

router.get("/", async (req, res) => {
	const users = await User.findAll();
	res.render("user-list", {
		users,
	});
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const user = await User.findByPk(id, {
		include: {
			model: Post,
		},
	});

	res.render("user-detail", {
		user,
		posts: user.Posts,
	});
});

router.get("/create", (req, res) => {
	res.render("user-form");
});

router.get("/update/:id", async (req, res) => {
	const id = req.params.id;
	const user = await User.findByPk(id);
	res.render("user-form", {
		user,
	});
});

router.post("/process", async (req, res) => {
	const form = req.body;
	if (!form.id) {
		// CREATE
		console.log("Creating");
		await User.create({
			email: form.email,
			password: form.password,
		});
	} else {
		// UPDATE
		console.log("Updating");
		await User.update(
			{
				email: form.email,
				password: form.password,
			},
			{ where: { id: form.id } }
		);
	}

	res.redirect("/");
});

router.post("/delete/:id", async (req, res) => {
	const id = req.params.id;
	await User.destroy({
		where: {
			id: id,
		},
	});

	res.redirect("/");
});

module.exports = router;
