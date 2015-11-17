
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean');

// *** *** *** MAIN TASKS *** *** ****

gulp.task('default', ['watcher'], function () {});

gulp.task('watcher', function () {
	gulp.watch(['work/assets/scss/**/*.scss'], ['css']);
});

gulp.task('css', ['clean:css'], function () {
	return gulp.src('work/assets/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('work/assets/css'))
		.pipe(git.add());
});

gulp.task('clean:css', function() {
	return gulp.src('work/assets/css', {read: false})
		.pipe(clean());
});