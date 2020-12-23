const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { numberFormatter, moneyFormatter } = global.import("./helpers/formatter");
const { MODEL_NOT_FOUND_ERROR } = global.import("./error.custom");
const URL = global.import("./helpers/urls");

const courseService = global.import("./services/course.service");

router.get("/", async (req, res) => {
	const courses = await courseService.findAll();
	res.render("dashboard/course/course-list", {
		layout: "dashboard",
		courses,
	});
});

router.get("/create", (req, res) => {
	const errObj = req.flash("errors");
	const oldValues = req.flash("oldValues");

	res.render("dashboard/course/course-form", {
		layout: "dashboard",
		errors: errObj[0], // Vì bất giá trị nào truyền qua flash đều sẽ nằm bên trong [],
		...oldValues[0],
	});
});

router.get("/edit/:id", async (req, res, next) => {
	const id = req.params.id;
	try {
		const course = await courseService.findById(id);
		res.render("dashboard/course/course-form", {
			layout: "dashboard",
			...course.dataValues,
		});
	} catch (err) {
		next(err);
		return;
	}
});

router.post("/delete/:id", async (req, res, next) => {
	const id = req.params.id;
	try {
		await courseService.deleteById(id);
		res.redirect(URL.COURSE_LIST);
	} catch (err) {
		next(err);
		return;
	}
});

router.post(
	"/save",
	[
		body("id").toInt(),
		body("title").notEmpty().withMessage("Không được để trống").trim(),

		body("author").notEmpty().withMessage("Không được để trống").trim(),

		body("image_url")
			.notEmpty()
			.withMessage("Không được để trống")
			.isURL()
			.withMessage("Cần phải là địa chỉ URL"),

		body("price")
			.notEmpty()
			.withMessage("Không được để trống")
			.isInt()
			.withMessage("Cần phải là số")
			.toInt(),
	],
	async (req, res, next) => {
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
			req.flash("oldValues", req.body);
			res.redirect(URL.COURSE_CREATE_FORM);
			return;
		}

		try {
			const course = await courseService.save(req.body);
			res.redirect(URL.COURSE_LIST);
		} catch (err) {
			next(err);
			return;
		}
	}
);

module.exports = router;
