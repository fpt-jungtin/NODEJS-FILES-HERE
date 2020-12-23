global.import = function (path) {
	return require(path);
};

const path = require("path");
const reload = require("reload");
const URL = global.import("./helpers/urls");
const flash = require("connect-flash");
const session = require("express-session");
const db = require("./config/database");

/* Error */
const { errHandlerMiddleware } = require("./error.custom");
/* Route */
const homeRoute = require("./routes/home.route");
const courseRoute = require("./routes/course.route");

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

/* Set Static */
app.use(express.static(path.join(__dirname, "public")));

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
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "xHjnM5sTJungtin",
		resave: true,
		saveUninitialized: false,
		cookie: {
			path: "/", // Set-Cookie Path : root path of domain
			httpOnly: true, // Chỉ chấp nhập http -> document.cookie => '' ở client(tránh xss)
			secure: false, // chỉ chấp nhận ssl
			maxAge: null, // Set-Cookie: Expires
			domain: "www.jungtin.me", // default = null, vì cookie sẽ applied lên domain hiện tại
			expires: new Date(Date.now() + 3600), // 3600s
			/* 
			Nếu cả 2 expires & maxAge đều set -> last one defined sẽ được sdung
			*expires không nên set trực tiếp, luôn sử dụng maxAge
			expires dùng như này : 
				req.session.cookie.expires = new Date(Date.now() + 3600)
		*/
			sameSite: true,
			/* VALUES : 
			true : Strict for strict same site enforcement.
			false
			'lax' : Lax for lax same site enforcement.
			'none' : None for an explicit cross-site cookie.
			'strict' : Strict for strict same site enforcement.
		*/
		},
	})
);
app.use(flash());

/* Route */
app.locals.URL = URL;
app.use(homeRoute);
app.use("/dashboard/courses", courseRoute);

/* 
	Error Handling
	- Phải đặt ở cuối cùng sau tất cả các routes & middlewares khác 
*/
app.use(errHandlerMiddleware);

/* Server */
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// 	console.log(`Server is running on PORT: ${PORT}`);
// });
reload(app);

/* Database - ORM */
db.sync({
	// force: true,
})
	.then((rs) => {
		console.log("Đã kết nối thành công với DB");

		app.listen(PORT, () => {
			console.log(`Server is running on PORT: ${PORT}`);
		});
	})
	.catch((err) => {
		console.error(err);
	});
