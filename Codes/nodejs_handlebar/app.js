const path = require("path");
const reload = require("reload");

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
		helpers: {
			renderName: (context) => {
				/* Function Helper */
				return `Tên là : ${context}`;
			},
			studentTable: (context, options) => {
				console.log(context);
				console.log(options.fn(context[0]));
				console.log(options.hash);

				/* Get Attrs */
				let attrs = "";
				Object.keys(options.hash).forEach((key) => {
					attrs += `${key}="${options.hash[key]}" `;
				});

				/* Render */
				let studentList = "";
				context.forEach((student) => {
					let btnHtml = options.fn(student);
					studentList += `<tr>
						<td>${student.id}</td>
						<td>${student.name}</td>
						<td>${student.age}</td>
						<td>${btnHtml}</td>
					</tr>`;
				});

				const html = `<table ${attrs}>
					${studentList}
				</table>`;
				return html;
			},
		},
	})
);
app.set("view engine", "hbs");


/* Middleware */
/* Route */
app.get("/", (req, res) => {
	res.render("home", {
		students: [
			{
				id: 1,
				name: "Trung Thinh",
				age: 19,
			},
			{
				id: 2,
				name: "Hoang Nam",
				age: 19,
			},
			{
				id: 3,
				name: "Hieu Nguyen",
				age: 21,
			},
		],
	});
});

/* Server */
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on PORT: ${port}`);
});
reload(app);
