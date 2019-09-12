const gulp = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();
const inky = require('inky');
const fs = require('fs');
const juice = require('juice');

//Tasks
let convertPaniniTask = (done) => {
	panini.refresh();
	gulp.src('./src/templates/pages/*.html')
		.pipe(panini ({
			root: './src/templates/pages/',
			layouts: './src/templates/layout/',
			partials: './src/templates/partials/',
			data: './src/assets/data',
			helpers: './src/helpers/',
		}))
		.pipe(inky({
			dest: 'dist/pages'
		}));
	done();
}

let convertScssTask = (done) => {
	gulp.src('./src/assets/css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
	done();
}

let moveImagesTask = (done) => {
	gulp.src('./src/assets/img/*.*')
		.pipe(gulp.dest('./dist/img'));
	done();
}

let movePDFTask = (done) => {
	gulp.src('./src/assets/img/*.pdf')
		.pipe(gulp.dest('./dist/pdf'));
	done();
}

let juicify = (done) => {
	setTimeout(() => {

		juice.juiceFile('./dist/pages/example-1.html', {}, (err, html) => {
			console.log(err);
			fs.writeFile("./dist/pages/example-1.html", html, (err) => {
				if(err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
		});

	}, 100);

	done();
};

let clearDist = (done) => {
	del.sync('./dist');
	done();
}

let browserSyncReloadTask = (done) => {
	browserSync.reload();
	done();
}

let browserSyncTask = (done) => {
	browserSync.init({
		server: {
			baseDir: './dist',
			index: 'pages/example-1.html',
			notify: false
		}
	});
	done();
}

let watchTask = (done) => {
	gulp.watch('./src').on('change', gulp.series(clearDist,convertPaniniTask,convertScssTask,moveImagesTask,browserSyncReloadTask));
	done();
}


//Dev Task
exports.dev = gulp.series(clearDist,gulp.parallel(convertPaniniTask,convertScssTask,moveImagesTask),browserSyncTask,watchTask);

//Build Task
exports.build = gulp.series(gulp.parallel(convertPaniniTask,convertScssTask),juicify);

//Utility Tasks
exports.clean = clearDist;
