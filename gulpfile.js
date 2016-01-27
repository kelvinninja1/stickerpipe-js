
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	include = require('gulp-include'),
	git = require('gulp-git'),
	concatCss = require('gulp-concat-css'),
	spritesmith = require('gulp.spritesmith'),
	minifyCss = require('gulp-minify-css');

var pluginName = 'stickerpipe',
	exampleSrc = '../demo/work/demo/libs/sdk';

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['src/scss/**/*.scss'], ['build:css']);
	gulp.watch(['src/js/**/*.js'], ['build:js']);
	gulp.watch(['src/img/icons/*.*'], ['build:img:icons']);

	gulp.watch(['build/**/*.*'], ['update:example']);
});

gulp.task('build:css', ['clean:css'], function () {
	return gulp.src('src/scss/' + pluginName + '.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(concatCss(pluginName + '.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(git.add())
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build/css'))
		.pipe(git.add());
});

gulp.task('build:js', ['clean:js'], function() {
	// todo: rename pluginName + '.js' --> app.js --> gulp.dest(... pluginName + '.js')
	return gulp.src(['src/js/' + pluginName + '.js'])
		.pipe(include())
		.pipe(gulp.dest('build/js'))
		.pipe(uglify({mangle: false}))
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build/js'));
});

gulp.task('build:img:icons', ['clean:img:icons'], function() {
	var hash = (+new Date()),
		img1x = 'icons.' + hash + '.png',
		img2x = 'icons@2x.' + hash + '.png';


	var spriteData = gulp.src('src/img/icons/*.*')
		.pipe(spritesmith({
			cssName: '_icons.scss',
			retinaSrcFilter: ['src/img/icons/*@2x.*'],

			retinaImgName: img2x,
			retinaImgPath: '../img/icons/' + img2x,

			imgName: img1x,
			imgPath: '../img/icons/' + img1x,
			cssVarMap: function (sprite) {
				sprite.name = 'sp-icon-' + sprite.name;
			}
		}));

	spriteData.img
		.pipe(gulp.dest('build/img/icons/')) // save sprite img file
		.pipe(git.add());

	return spriteData.css.pipe(gulp.dest('src/scss/')); // save scss file
});

gulp.task('update:example', ['clean:example'], function() {
	return gulp.src(['build/**/*.*'])
		.pipe(gulp.dest(exampleSrc));
});


// *** *** *** CLEANS *** *** ****

gulp.task('clean:css', function() {
	return gulp.src('build/css', {read: false})
		.pipe(clean());
});
gulp.task('clean:js', function() {
	return gulp.src('build/js', {read: false})
		.pipe(clean());
});
gulp.task('clean:img:icons', function() {
	return gulp.src('build/img/icons', {read: false})
		.pipe(clean());
});
gulp.task('clean:example', function() {
	return gulp.src(exampleSrc, {read: false})
		.pipe(clean({
			force: true
		}));
});