const gulp = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();
const inky = require('inky');
const fs = require('fs');
const juice = require('juice');
const replace = require('gulp-replace');
const config = require('./src/assets/data/config');

//Variables

let emailName = `${config.brand}-${config.country}-${config.language}-${config.type}-${config.name}-${config.version}`;
let emailFileName;

//Tasks

let getName = (done) => {
	emailFileName = fs.readdirSync('src/templates/pages/');
	emailFileName = emailFileName.find((element) => {
		return element.includes('.html');
	});
	done();
}

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
		juice.juiceFile(`./dist/pages/${emailFileName}`, {}, (err, html) => {
			console.log(err);
			fs.writeFile(`./dist/${emailName}.html`, html, (err) => {
				if(err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
		});
	}, 150);
	done();
};

let delOldFiles = (done) => {
	setTimeout(() => {
		del.sync('./dist/pages');
		del.sync('./dist/css');
	}, 200);
	done();
}

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
			index: `pages/${emailFileName}`,
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
exports.dev = gulp.series(getName,clearDist,gulp.parallel(convertPaniniTask,convertScssTask,moveImagesTask,movePDFTask),browserSyncTask,watchTask);

//Build Task
exports.build = gulp.series(getName,clearDist,gulp.parallel(convertPaniniTask,convertScssTask,moveImagesTask,movePDFTask),juicify,delOldFiles);

//Utility Tasks
exports.clean = clearDist;
