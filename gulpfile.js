
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

var exampleSrc = '../gh-pages/work/demo/libs/sdk';

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['src/scss/**/*.scss'], ['build:css']);
	gulp.watch(['src/js/**/*.js'], ['build:js']);
	gulp.watch(['src/img/icons/*.*'], ['build:img:sprite']);

	gulp.watch(['build/**/*.*'], ['update:example']);
});

gulp.task('build:css', ['clean:css'], function () {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('build/css'))
		.pipe(git.add());
}); // todo concat

gulp.task('build:js', ['clean:js'], function() {
	return gulp.src(['src/js/stickerpipe.js'])
		.pipe(include())
		.pipe(gulp.dest('build/js'))
		.pipe(uglify({mangle: false}))
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(gulp.dest('build/js'));
});

gulp.task('update:example', ['clean:example'], function() {
	return gulp.src(['build/**/*.*'])
		.pipe(gulp.dest(exampleSrc));
});

gulp.task('build:img:sprite', function() {
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

gulp.task('clean:css', function() {
	return gulp.src('build/css', {read: false})
		.pipe(clean());
});
gulp.task('clean:js', function() {
	return gulp.src('build/js', {read: false})
		.pipe(clean());
});
gulp.task('clean:example', function() {
	return gulp.src(exampleSrc, {read: false})
		.pipe(clean({
			force: true
		}));
});