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
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: "xHjnM5sTJungtin",
		resave: true,
		saveUninitialized: false,
	})
);
const csrf = require("csurf");
const csrfProtection = csrf();
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());
app.use(csrfProtection); // phải đặt sau cookie-parser
app.use(flash()); // phải đặt sau session
app.use((req, res, next) => {
	res.locals.URL = URL;
	res.locals.csrfToken = req.csrfToken();
	next();
}); // middleware của csrfToken phải đặt trước tất cả routes

/* Route */
app.use(homeRoute);
app.use("/dashboard/courses", courseRoute);

app.get("/upload", (req, res) => {
	res.render("upload-form", { layout: false });
});
const multer = require("multer");
// const upload = multer({
// 	dest: "folder_name",
// 	fileFilter: (req, res, cb) => {
// 		// To reject this file pass `false`, like so:
// 		cb(null, false);

// 		// To accept the file pass `true`, like so:
// 		cb(null, true);

// 		// You can always pass an error if something goes wrong:
// 		cb(new Error("I don't have a clue!"));
// 	},
// 	limits: {
// 		fieldNameSize: 100, // field's Name size (100 bytes)
// 		fieldSize: 1024, // field value size (1024 bytes)
// 		fields: Number.POSITIVE_INFINITY, // max num of non-file fields
// 		fileSize: Number.POSITIVE_INFINITY, // max file size in total
// 		files: Number.POSITIVE_INFINITY, // max num of file fields
// 		parts: Number.POSITIVE_INFINITY, // num of fields + files
// 		headerPairs: 2000, // max num of header key:value to parse
// 	},
// 	storage: multer.diskStorage({
// 		destination: function (req, file, cb) {
// 			cb(null, "/tmp/my-uploads");
// 		},
// 		filename: function (req, file, cb) {
// 			cb(null, file.fieldname + "-" + Date.now());
// 		},
// 	}),
// });

var fileStorage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const fs = require("fs");
		try {
			if (!fs.existsSync("./images")) {
				fs.mkdirSync("./images");
			}
			cb(null, "./images");
		} catch (err) {
			console.error(err);
		}
	},
	filename: function (req, file, cb) {
		cb(null, `custom-${file.originalname}`);
		// không sử dụng Date được vì tên của nó có space => sai
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true); // save file
	} else {
		/* 
			Lưu ý : ở đây chỉ duyệt để không lưu thôi 
			chứ không trả lại thông báo ở response 
		*/
		console.log("THÔNG BÁO : KHÔNG SAVE");
		cb(null, false); // không save file
	}
};

const upload = multer({
	storage: fileStorage,
	fileFilter: fileFilter,
});

app.post("/upload", upload.single("image"), (req, res) => {
	if (!req.file) {
		const error = new Error("Please upload a file");
		error.httpStatusCode = 400;
		return next(error);
	}
	res.end();
});

app.post("/upload-multi", upload.array("image", 10), (req, res) => {
	if (!req.files) {
		const error = new Error("Please choose files");
		error.httpStatusCode = 400;
		return next(error);
	}
	console.log(req.files);
	res.end();
});

app.get("/download", (req, res) => {
	const fs = require("fs");
	const filePath = "./images/girl.jpg";

	const stream = fs.createReadStream(filePath);
	res.setHeader("Content-Type", "image/jpeg");
	res.setHeader("Content-Disposition", `attachment; filename="girl.jpg"`);
	stream.pipe(res);
});

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
