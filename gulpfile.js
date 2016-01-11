
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean'),
	spritesmith = require('gulp.spritesmith');

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['work/demo/assets/scss/**/*.scss'], ['css']);

	gulp.watch(['work/demo/assets/img/icons/*.*'], ['img:sprite']);
});

gulp.task('css', ['clean:css'], function () {
	return gulp.src('work/demo/assets/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('work/demo/assets/css'))
		//.pipe(git.add())
		;
});

gulp.task('clean:css', function() {
	return gulp.src('work/demo/assets/css', {read: false})
		.pipe(clean());
});

gulp.task('img:sprite', function() {
	var spriteData = gulp.src('work/demo/assets/img/icons/*.*')
		.pipe(spritesmith({
			cssName: '_icons.scss',
			retinaSrcFilter: ['work/demo/assets/img/icons/*@2x.*'],

			retinaImgName: 'icons_sprite@2x.png',
			retinaImgPath: '../img/icons_sprite@2x.png',

			imgName: 'icons_sprite.png',
			imgPath: '../img/icons_sprite.png',
			cssVarMap: function (sprite) {
				sprite.name = 'icon-' + sprite.name;
			}
		}));

	spriteData.img.pipe(gulp.dest('work/demo/assets/img/')); // путь, куда сохраняем картинку
	return spriteData.css.pipe(gulp.dest('work/demo/assets/scss/'));
});