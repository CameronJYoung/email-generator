//Requires

const gulp = require('gulp');
const { src, dest } = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();
const inky = require('inky');
const fs = require('fs');
const fse = require('fs-extra');
const juice = require('juice');
const config = require('./src/assets/data/config');

//Variables

let emailName = `${config.brand}-${config.country}-${config.language}-${config.type}-${config.name}-${config.version}`;
let emailFileName;

//Task Functions

let getName = (done) => {
    emailFileName = fs.readdirSync('src/templates/pages/');
    emailFileName = emailFileName.find((element) => {
        return element.includes('.html');
    });
    done();
}

let convertPaniniTask = () => {
    panini.refresh();
    return gulp.src('./src/templates/pages/*.html')
        .pipe(panini ({
            root: './src/templates/pages/',
            layouts: './src/templates/layout/',
            partials: './src/templates/partials/',
            data: './src/assets/data',
            helpers: './src/helpers/',
        }))
        .pipe(inky({
            dest: '.tmp/'
        }));

}

let convertScssTask = (done) => {
    gulp.src('./src/assets/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./.tmp/css'));
    done();
}

let moveImagesTask = (done) => {
    gulp.src('./src/assets/img/*.*')
        .pipe(gulp.dest('./.tmp/img'));
    done();
}

let movePDFTask = (done) => {
    gulp.src('./src/assets/img/*.pdf')
        .pipe(gulp.dest('./.tmp/pdf'));
    done();
}

let juicify = (done) => {
	juice.juiceFile(`./.tmp/${emailFileName}`, {}, (err, html) => {
		console.log(err);
		fse.outputFile(`./.tmp/${emailName}.html`, html, (err) => {
			if(err) {
				return console.log(err);
			}
			// return console.log("The file was saved!");
			done();
		});
	});
};

let clearDist = (done) => {
    del.sync('./dist');
    done();
}

let clearTemp = (done) => {

		del.sync('./.tmp');



	done();
}
let clearTemp2 = (done) => {
	setTimeout(() => {
		del.sync('./.tmp');
	}, 500);




done();
}

let deleteOld = (done) => {

	del.sync(['./.tmp/css',`./.tmp/${emailFileName}`]);


    done();
}

let moveHtmlToDist = (done) => {
	return gulp.src(`./.tmp/${emailName}.html`)
		.pipe(gulp.dest('./dist/'));
}

let moveFoldersToDist = () => {
	return gulp.src(`./.tmp/**/*.*`)
		.pipe(gulp.dest('./dist/'));

}

let browserSyncReloadTask = (done) => {
    browserSync.reload();
    done();
}

let browserSyncTask = (done) => {
    browserSync.init({
        server: {
            baseDir: './.tmp',
            index: `${emailFileName}`,
            notify: false
        }
    });
    done();
}

let watchTask = (done) => {
    gulp.watch('./src').on('change',
    gulp.series(
        clearTemp,
        convertPaniniTask,
        convertScssTask,
        moveImagesTask,
		browserSyncReloadTask));
	done();
}

//Tasks

exports.dev = gulp.series( //Dev task
    getName,
    clearDist,
    clearTemp,
    gulp.parallel(
        convertPaniniTask,
        convertScssTask,
        moveImagesTask,
        movePDFTask,
	),
	watchTask,
    browserSyncTask,

);

exports.build = gulp.series( //Build task
    getName,
    clearDist,
    clearTemp,
    gulp.parallel(
        convertPaniniTask,
        convertScssTask,
        moveImagesTask,
        movePDFTask,
    ),
    juicify,
    deleteOld,
    moveHtmlToDist,
	moveFoldersToDist,
	clearTemp2
);
