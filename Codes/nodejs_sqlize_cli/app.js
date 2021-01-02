const express = require("express");
const handlebars = require("express-handlebars");
const omitEmpty = require("omit-empty");

const userRoute = require("./routes/user.route");
const postRoute = require("./routes/post.route");
const URL = require("./helpers/urls");

const app = express();

/* Set View Engine */
app.engine(
	"hbs",
	handlebars({
		extname: ".hbs",
		layoutsDir: __dirname + "/views/layouts",
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
			allowProtoMethodsByDefault: true,
		},
		/* Từ 4.6.0 Handlebars cấm access prototype prop & methods */
	})
);
app.set("view engine", "hbs");

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.locals.URL = URL;
	next();
});

const removeEmptyProperties = () => {
	return function (req, res, next) {
		req.body = omitEmpty(req.body);
		req.params = omitEmpty(req.params);
		req.query = omitEmpty(req.query);
		next();
	};
};
app.use(removeEmptyProperties());

/* Routes */
app.get("/", (req, res) => {
	res.redirect("/users");
});

app.use("/users", userRoute);
app.use("/posts", postRoute);

app.listen(3000, () => {
	console.log(`Server is running on PORT 3000`);
});
