var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var eslint = require("gulp-eslint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var imagemin = require("gulp-imagemin");

gulp.task("copy-html", function(){
	gulp.src("./index.html")
		.pipe(gulp.dest("./dist"));
});

gulp.task("copy-images", function(){
	gulp.src("./images/*")
		.pipe(imagemin())
		.pipe(gulp.dest("./dist/images"));
});

gulp.task("sass", function(){
	gulp.src("scss/**/*.scss")
		.pipe(sass({outputStyle: "compressed"})
			.on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
		.pipe(gulp.dest("dist/css"));
});

gulp.task("scripts", function(){
	gulp.src("js/**/*.js")
	.pipe(concat("all.js"))
	.pipe(gulp.dest("dist/js"));
});

gulp.task("scripts-dist", function(){
	gulp.src("js/**/*.js")
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(concat("all.js"))
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("dist/js"));
});

gulp.task("lint", function(){
	return gulp.src(["js/**/*.js"])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task("build", ["copy-html", "copy-images", "sass", "lint", "scripts-dist"]);

gulp.task("default", ["copy-html", "copy-images", "sass", "lint", "scripts"], function(){
	gulp.watch("../**/*.html", ["copy-html"]);
	gulp.watch("scss/**/*.scss", ["sass"]);
	gulp.watch("js/**/*.js", ["lint", "scripts"]);
	gulp.watch("./index.html")
		.on("change", browserSync.reload);
	browserSync.init({
		server: "./dist"
	});
	browserSync.stream();
});