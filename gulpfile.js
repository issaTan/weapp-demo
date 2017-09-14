const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const changed = require('gulp-changed');
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const del = require('del');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const base64 = require('gulp-base64');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const friendlyFormatter = require('eslint-friendly-formatter');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

const config = require('./.gulprc.js');

const prod = process.env.NODE_ENV === 'production';

gulp.task('clean', () => del([`${config.dest}/**`]));

// 处理js 文件，包括eslint/babel/压缩
let buildJsSrc = config.source.js;
gulp.task('buildJs', () => gulp.src(buildJsSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(gulpif(!prod, sourcemaps.init()))
  .pipe(eslint('.eslintrc.js'))
  .pipe(eslint.format(friendlyFormatter))
  .pipe(babel())
  .pipe(gulpif(prod, uglify()))
  .pipe(gulpif(!prod, sourcemaps.write()))
  .pipe(gulp.dest(config.dest)));

// 处理less文件
let buildLessSrc = config.source.less;
gulp.task('buildLess', () => gulp.src(buildLessSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(gulpif(!prod, sourcemaps.init()))
  .pipe(less())
  .pipe(base64({ extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'], maxImageSize: 10000, debug: true }))
  .pipe(gulpif(prod, cleanCss()))
  .pipe(gulpif(!prod, sourcemaps.write()))
  .pipe(rename((parsedPath) => { parsedPath.extname = '.wxss'; }))
  .pipe(gulp.dest(config.dest)));

// 处理wxss 文件
let buildWxssSrc = config.source.wxss;
gulp.task('buildWxss', () => gulp.src(buildWxssSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(gulp.dest(config.dest)));

// 处理图片
let buildImageSrc = config.source.img;
gulp.task('buildImage', () => gulp.src(buildImageSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(imagemin())
  .pipe(gulp.dest(`${config.dest}`)));

// 处理wxml
let buildWxmlSrc = config.source.wxml;
gulp.task('buildWxml', () => gulp.src(buildWxmlSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(gulpif(prod, htmlmin()))
  .pipe(gulp.dest(config.dest)));

// 处理json
let buildJsonSrc = config.source.json;
gulp.task('buildJson', () => gulp.src(buildJsonSrc, { base: config.base })
  .pipe(changed(config.dest))
  .pipe(gulp.dest(config.dest)));

gulp.task('buildContent', (cb) => {
  gulpSequence('buildImage', 'buildLess', 'buildJs', 'buildWxml', 'buildJson')(cb);
});

gulp.task('build', (cb) => {
  gulpSequence('clean', 'buildContent')(cb);
});

gulp.task('watch', gulpSequence('buildContent', () => {
  watch(config.source.js, { debounceDelay: 200 }, (res) => {
    buildJsSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildJs');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
  watch(config.source.less, { debounceDelay: 200 }, (res) => {
    buildLessSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildLess');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
  watch(config.source.wxss, { debounceDelay: 200 }, (res) => {
    buildWxssSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildWxss');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
  watch(config.source.img, { debounceDelay: 200 }, (res) => {
    buildImageSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildImage');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
  watch(config.source.wxml, { debounceDelay: 200 }, (res) => {
    buildWxmlSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildWxml');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
  watch(config.source.json, { debounceDelay: 200 }, (res) => {
    buildJsonSrc = [`${config.base}/${res.relative}`];
    gulp.start('buildJson');
    gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
  });
}));

gulp.task('default', ['watch']);
