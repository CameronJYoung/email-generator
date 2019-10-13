//Requires

const gulp = require('gulp');
const {src,dest,series,parallel,watch} = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();
const inky = require('inky');
const fs = require('fs-extra');
const juice = require('juice');
const fm = require('front-matter');

//Variables

let frontmatterData;
let emailName;
let emailFileName;
let typePath;

// utility functions

let getFrontMatter = (done) => {
	fs.readFile(`./src/templates/pages/${emailFileName}`, 'utf8', (err, data) => {
		if (err) throw err;

		frontmatterData = (fm(data)).attributes;
		emailName = `${frontmatterData.brand}-${frontmatterData.country}-${frontmatterData.language}-${frontmatterData.type}-${frontmatterData.name}-${frontmatterData.version}`;
		checkType(frontmatterData.type);
		done();
	});
}

let checkType = (type) => {
	console.log(type)
	if (type === 'dynamic') {
		typePath = './dist/DYN';
	} else if (type === 'static') {
		typePath = './dist/STA';
	}
}

//Task Functions

let getName = (done) => {
	emailFileName = fs.readdirSync('src/templates/pages/')
		.find((element) => element.includes('.html'));

	done();
}

let convertPaniniTask = () => {
	panini.refresh();
	return src('./src/templates/pages/*.html')
		.pipe(panini({
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

let convertScssTask = () => {
	return src('./src/assets/css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(dest('./.tmp/css'));
}

let moveImagesTask = () => {
	return src('./src/assets/img/*.*')
		.pipe(dest('./.tmp/img'));
}

let movePDFTask = () => {
	return src('./src/assets/img/*.pdf')
		.pipe(dest('./.tmp/pdf'));
}

let juicify = (done) => {
	juice.juiceFile(`./.tmp/${emailFileName}`, {}, (err, html) => {
		if (err) console.log(err);
		fs.outputFile(`./.tmp/${emailName}.html`, html, (err) => {
			if (err) return console.log(err);
			done();
		});
	});
};

let clearDist = () => del('./dist');

let clearTemp = () => del('./.tmp');

let deleteOld = () => del(['./.tmp/css', `./.tmp/${emailFileName}`]);

let moveHtmlToDist = () => {
	return src(`./.tmp/${emailName}.html`)
		.pipe(dest(`${typePath}`));

}

let moveFoldersToDist = () => {
	return src(`./.tmp/**/*.*`)
		.pipe(dest(`${typePath}`));

}

let browserSyncReloadTask = (done) => {
	browserSync.reload();
	done();
}

let browserSyncTask = () => {
	browserSync.init({
		server: {
			baseDir: './.tmp',
			index: `${emailFileName}`,
			notify: false
		}
	});

	watch('./src').on('change',
		series(
			clearTemp,
			convertPaniniTask,
			convertScssTask,
			moveImagesTask,
			browserSyncReloadTask
		)
	);
}

//Tasks

exports.dev = series( //Dev task
	getName,
	getFrontMatter,
	clearDist,
	clearTemp,
	parallel(
		convertPaniniTask,
		convertScssTask,
		moveImagesTask,
		movePDFTask,
	),
	browserSyncTask,
);

exports.build = series( //Build task
	getName,
	getFrontMatter,
	clearDist,
	clearTemp,
	parallel(
		convertPaniniTask,
		convertScssTask,
		moveImagesTask,
		movePDFTask,
	),
	juicify,
	deleteOld,
	moveHtmlToDist,
	moveFoldersToDist,
	clearTemp
);

exports.test = series(getName,getFrontMatter);
