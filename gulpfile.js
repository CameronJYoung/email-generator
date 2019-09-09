const gulp = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();

let convertHbsTask = (done) => {
	panini.refresh();
	gulp.src('./src/templates/pages/*.html')
		.pipe(panini ({
			root: './src/templates/pages/',
			layouts: './src/templates/layout/',
			partials: './src/templates/partials/',
			data: './src/data/',
//			helpers: 'helpers/',
		}))
		.pipe(gulp.dest('dist/pages'));
	done();
}


exports.hbs = convertHbsTask;
