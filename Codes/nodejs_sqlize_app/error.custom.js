class MODEL_NOT_FOUND_ERROR {
	constructor(modelName, modelId) {
		this.message = `Can't not found ${modelName} with id : ${modelId}`;
	}
}

/* Handler */
const errHandlerMiddleware = async (err, req, res, next) => {
	if (err instanceof MODEL_NOT_FOUND_ERROR) {
		console.error(err);
		res.render("404", { layout: false, error: err });
		return;
	}

	next(err);
};

module.exports = {
	MODEL_NOT_FOUND_ERROR,

	errHandlerMiddleware,
};
