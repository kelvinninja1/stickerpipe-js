
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean');

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['work/demo/assets/scss/**/*.scss'], ['css']);
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