
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean'),
	spritesmith = require('gulp.spritesmith');

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['scss/**/*.scss'], ['css']);

	gulp.watch(['img/icons/*.*'], ['img:sprite']);
});

gulp.task('css', ['clean:css'], function () {
	return gulp.src('scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('css'));
});

gulp.task('clean:css', function() {
	return gulp.src('css', {read: false})
		.pipe(clean());
});

gulp.task('img:sprite', function() {
	var spriteData = gulp.src('img/icons/*.*')
		.pipe(spritesmith({
			cssName: '_icons.scss',
			retinaSrcFilter: ['img/icons/*@2x.*'],

			retinaImgName: 'icons_sprite@2x.png',
			retinaImgPath: '../img/icons_sprite@2x.png',

			imgName: 'icons_sprite.png',
			imgPath: '../img/icons_sprite.png',
			cssVarMap: function (sprite) {
				sprite.name = 'icon-' + sprite.name;
			}
		}));

	spriteData.img.pipe(gulp.dest('img/')); // путь, куда сохраняем картинку
	return spriteData.css.pipe(gulp.dest('scss/'));
});