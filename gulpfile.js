
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
	spritesmith = require('gulp.spritesmith');

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', ['watcher:src', 'watcher:example'], function () {});
gulp.task('watcher:src', function () {
	gulp.watch(['src/scss/**/*.scss'], ['css:build']);
	gulp.watch(['src/js/**/*.js'], ['js:build']);
	gulp.watch(['src/img/icons/*.*'], ['img:sprite']);
});
gulp.task('watcher:example', function () {
	gulp.watch(['example/scss/**/*.scss'], ['css:example']);
});

gulp.task('css:example', ['clean:example:css'], function () {
	return gulp.src('example/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('example/css'))
		.pipe(git.add());
});
gulp.task('css:build', ['clean:build:css'], function () {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('build/css'))
		.pipe(git.add());
}); // todo concat

gulp.task('js:build', ['clean:build:js'], function() {
	return gulp.src(['src/js/stickerpipe.js'])
		.pipe(include())
		.pipe(gulp.dest('build/js'))
		.pipe(uglify({mangle: false}))
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build/js'));
});

gulp.task('img:sprite', function() {
	var spriteData = gulp.src('src/img/icons/*.*')
		.pipe(spritesmith({
			cssName: '_icons.scss',
			retinaSrcFilter: ['src/img/icons/*@2x.*'],

			retinaImgName: 'icons_sprite@2x.png',
			retinaImgPath: '../img/icons_sprite@2x.png',

			imgName: 'icons_sprite.png',
			imgPath: '../img/icons_sprite.png',
			cssVarMap: function (sprite) {
				sprite.name = 'sp-icon-' + sprite.name;
			}
		}));

	spriteData.img.pipe(gulp.dest('build/img/')); // путь, куда сохраняем картинку
	return spriteData.css.pipe(gulp.dest('src/scss/'));
});

// *** *** *** CLEANS *** *** ****

gulp.task('clean:example:css', function() {
	return gulp.src('example/css', {read: false})
		.pipe(clean());
});
gulp.task('clean:build:css', function() {
	return gulp.src('build/css', {read: false})
		.pipe(clean());
});
gulp.task('clean:build:js', function() {
	return gulp.src('build/js', {read: false})
		.pipe(clean());
});