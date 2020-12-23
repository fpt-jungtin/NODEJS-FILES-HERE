const { MODEL_NOT_FOUND_ERROR } = require("../error.custom");

const Course = global.import("./models/Course");

const save = async function (body) {
	if (isNaN(body.id) || body.id === "") {
		console.log("Create Course");
		delete body.id;
		const newCourse = await Course.create({
			title: body.title,
			author: body.author,
			imageUrl: body.image_url,
			price: body.price,
		});

		return newCourse; // return Object (gồm : values, prevValues, options)
	} else {
		console.log("Update Course");
		const id = body.id;
		delete body.id;
		return Course.update(
			{
				title: body.title,
				author: body.author,
				imageUrl: body.image_url,
				price: body.price,
			},
			{
				where: {
					id: id,
				},
			}
		);
	}
};

const findAll = async function () {
	return Course.findAll();
};

const findById = async function (id) {
	let course;
	try {
		course = await Course.findByPk(id);
	} catch (err) {
		console.error(err);
	}

	if (course === null) throw new MODEL_NOT_FOUND_ERROR("Course", id);

	return course;
};

const deleteById = async function (id) {
	const course = await findById(id);
	try {
		course.destroy();
	} catch (err) {
		console.error(err);
	}

	return course;
};

module.exports = {
	save,
	findAll,
	findById,
	deleteById,
};
