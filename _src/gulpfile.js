let path_source = "",
	path_dist = "assets/",
	path = {
		src: {
			css: path_source + 'scss/',
			css_critical: path_source + 'scss-critical/',
			js: path_source + 'js/'
		},
		watch: {
			css: path_source + 'scss/**/*.scss',
			css_critical: path_source + 'scss-critical/**/*.scss',
			js: path_source + 'js/**/*.js'
		},
		build: {
			css: '../' + path_dist,
			css_critical: '../snippets/',
			js: path_dist + 'js/'
		}
	};

	let { src, dest } = require('gulp'),
		gulp = require('gulp'),
		// plumber = require('gulp-plumber'),
		sass = require('gulp-sass'),
		// autoprefixer = require('gulp-autoprefixer'),
		csscomb	= require('gulp-csscomb'),
		gcmq = require('gulp-group-css-media-queries'),
		clean_css = require('gulp-clean-css'),
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		// concat = require('gulp-concat'),
		minify = require('gulp-minify'),
		include = require('gulp-include');

function css() {
	return src(path.src.css + '**/*.scss')
			.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError))
			.pipe(gcmq('.csscomb.json'))
			.pipe(csscomb())
			.pipe(sourcemaps.write())
			// .pipe(sourcemaps.write())
			.pipe(gulp.dest(path.build.css));
}

function cssmin() {
	return src(path.src.css + '**/*.scss')
			.pipe(sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError))
			.pipe(gcmq('.csscomb.json'))
			.pipe(csscomb())
			.pipe(clean_css())
			// .pipe(autoprefixer({
			// 	overrideBrowserslist : ['last 2 versions'],
			// 	cascade: true
			// }))
			.pipe(rename({
				extname: ".min.css"
			}))
			.pipe(gulp.dest(path.build.css));
			// .pipe(browserSync.stream());
}

function css_critical() {
	return src(path.src.css_critical + '**/*.scss')
			// .pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError))
			.pipe(gcmq('.csscomb.json'))
			.pipe(csscomb())
			// .pipe(sourcemaps.write())
			.pipe(clean_css())
			.pipe(rename({
				extname: ".liquid"
			}))
			.pipe(gulp.dest(path.build.css_critical));
			// .pipe(gulp.dest(path.build.css));
			// .pipe(browserSync.stream());
}

function js(done) {
	gulp.src([path.src.js + '*.js', '!' + path.src.js + '_*.js'])
		.pipe(include())
		.on('error', console.log)
		.pipe(minify())
		.pipe(gulp.dest('../assets/'));
		done();
}

function watchFiles(params) {
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.css], cssmin);
	gulp.watch([path.watch.css_critical], css_critical);
	gulp.watch([path.watch.js], js);
}

let build = gulp.series(gulp.parallel(js, cssmin, css, css_critical));
let watch = gulp.parallel(watchFiles);

exports.js = js;
exports.css = css;
exports.cssmin = cssmin;
exports.css_critical = css_critical;
exports.default = watch;