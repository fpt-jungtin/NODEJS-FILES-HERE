const path = require("path");
const reload = require("reload");

const express = require("express");
const handlebars = require("express-handlebars");
const { body, param, validationResult } = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "xHjnM5sTJungtin", resave: true, saveUninitialized: false }));
app.use(flash());
/* Set Static */
app.use(express.static(path.join(__dirname, "public")));

/* Set View Engine */
app.engine(
	"hbs",
	handlebars({
		extname: ".hbs",
		layoutsDir: __dirname + "/views/layouts",
	})
);
app.set("view engine", "hbs");

/* Route */
app.get("/", (req, res) => {
	const errObj = req.flash("errors");
	res.render("basic", {
		errors: errObj[0], // Vì bất giá trị nào truyền qua flash đều sẽ nằm bên trong []
	});
});

app.post(
	"/validation",
	[
		body("email").isEmail().withMessage("không phải là email"),
		body("username")
			.notEmpty()
			.withMessage("không được để trống")
			.isLength({ min: 8 })
			.withMessage("Phải dài ít nhất 8 chars"),
		body("password")
			.notEmpty()
			.withMessage("không được để trống")
			.isLength({ min: 8 })
			.withMessage("Phải dài ít nhất 8 chars"),
		body("re-password")
			.notEmpty()
			.withMessage("không được để trống")
			.custom((value, { req }) => {
				if (value !== req.body.password)
					throw new Error("Re-password phải trùng với lại password");

				return true; // phải return True chứ không là nó cho fail luôn
			}),
	],
	(req, res) => {
		const rs = validationResult(req);

		if (rs.errors.length > 0) {
			/* Filter Errors for View */
			const errObj = {};
			rs.errors
				.filter((err) => {
					return err.location === "body";
				})
				.forEach((err) => {
					errObj[err.param] = `${err.param.charAt(0).toUpperCase() + err.param.slice(1)} 
						${err.msg.toLowerCase()}`;
				});

			req.flash("errors", errObj);
			res.redirect("/");
			return;
		}

		console.log("Không có lỗi gì cả! Thành công rồi <3");
		res.end();
	}
);

/* Validate path */
app.get(
	"/students/:id",
	[
		param("id")
			.isInt()
			.withMessage("phải là số")
			.custom((value) => {
				// query trong database
				const existedIDs = [1, 2, 4, 5, 6, 7];
				if (!existedIDs.includes(parseInt(value)))
					throw new Error("Không tìm thấy Student");

				return true;
			}),
	],
	(req, res) => {
		const rs = validationResult(req);
		if (rs.errors.length > 0) {
			throw new Error(`404 Không tìm thấy student với id : ${req.params.id}`);
		}

		res.end();
	}
);

/* Server */
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on PORT: ${port}`);
});
reload(app);
