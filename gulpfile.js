const 
	gulp          	= require("gulp"),
	browserSync   	= require("browser-sync"),
	sass 			= require("gulp-sass"),
	rename			= require("gulp-rename"),
	autoprefixer  	= require("gulp-autoprefixer"),
	cleanCSS 		= require("gulp-clean-css"),
	htmlmin			= require("gulp-htmlmin"),
	image 			= require("gulp-image"),
	webpack 	  	= require("webpack"),
	webpackStream 	= require("webpack-stream"),
	webpackConfig 	= require("./webpack.config.js");


gulp.task("server", function() {
	browserSync.init({
		proxy: "localhost:8080/alexis/dist/index.html",
	});
});

gulp.task("styles", function() {
	return gulp
		   .src("src/blocks/main.scss")
		   .pipe(sass(
			   {
					outputStyle: "compressed"
			   }
		   ).on("error", sass.logError))
		   .pipe(rename({
				prefix: "",
				suffix: ".min",
			}))
		   .pipe(autoprefixer({
				cascade: false
		   }))
		   .pipe(cleanCSS({
			   compatibility: "ie8"
		   }))
		   .pipe(gulp.dest("dist/css"))
		   .pipe(browserSync.stream());
});

gulp.task("htmlmin", function() {
	gulp
		.src("src/*.html")
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("dist"))
		.pipe(browserSync.stream());
});

gulp.task("imagemin", function() {
	return	gulp
			.src("src/img/**/*")
			.pipe(image())
			.pipe(gulp.dest("dist/img"));
});

gulp.task("iconmin", function() {
	return	gulp
			.src("src/icons/**/*")
			.pipe(image())
			.pipe(gulp.dest("dist/icons"));
});

gulp.task("fonts", function() {
	return gulp
			.src("src/fonts/**/*")
			.pipe(gulp.dest("dist/fonts"));
});

gulp.task("phpmailer", function() {
	return gulp
			.src("src/phpmailer/**/*")
			.pipe(gulp.dest("dist/phpmailer"));
});

gulp.task("scripts", function() { 
	gulp
		.src("src/js/*.js")
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream());
});


gulp.task("watch", function() {
	gulp.watch("src/blocks/**/*.+(scss|sass|css)", gulp.parallel("styles"));
	gulp.watch("src/blocks/**/*.js").on("change", gulp.parallel("scripts"));
	gulp.watch("src/*.html").on("change", gulp.parallel("htmlmin"));
	gulp.watch("src/js/*.js").on("change", gulp.parallel("scripts"));
	gulp.watch("src/img/**/*").on("change", gulp.parallel("imagemin"));
	gulp.watch("src/icons/**/*").on("change", gulp.parallel("iconmin"));
});

gulp.task("default", gulp.parallel("watch", "server", "styles", "htmlmin", "imagemin", "iconmin", "fonts", "phpmailer", "scripts"));