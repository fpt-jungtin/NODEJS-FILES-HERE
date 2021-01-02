const router = require("express").Router();
const { User, Post } = require("../models");

router.get("/", async (req, res) => {
	const posts = await Post.findAll();
	res.render("post-list", {
		posts,
	});
});

router.get("/create", (req, res) => {
	res.render("post-form");
});

// router.get("/update/:id", async (req, res) => {
// 	const id = req.params.id;
// 	const post = await User.findByPk(id);
// 	res.render("post-form", {
// 		post,
// 	});
// });

router.post("/process", async (req, res) => {
	const form = req.body;
	if (!form.id) {
		// CREATE
		console.log("Creating");
		const author = await User.findOne({ where: { email: "jungtin@gmail.com" } });
		console.log(JSON.stringify(author, null, 2));
		const newPost = await author.createPost({
			title: form.title,
			content: form.content,
		});
		console.log(JSON.stringify(newPost, null, 2));
	} else {
		// UPDATE
		// console.log("Updating");
		// await User.update(
		// 	{
		// 		email: form.email,
		// 		password: form.password,
		// 	},
		// 	{ where: { id: form.id } }
		// );
	}

	res.redirect("/");
});

// router.post("/delete/:id", async (req, res) => {
// 	const id = req.params.id;
// 	await User.destroy({
// 		where: {
// 			id: id,
// 		},
// 	});

// 	res.redirect("/");
// });

module.exports = router;
