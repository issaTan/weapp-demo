const gulp = require('gulp');
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

const prod = process.env.NODE_ENV === 'production';

// gulp 输入源
const jsSrc = ['src/**/**.js'];
const lessSrc = ['src/**/**.less'];
const imgSrc = ['src/imgs/*'];
const wxmlSrc = ['src/**/**.wxml'];
const jsonSrc = ['src/**/**.json'];
const src = jsonSrc.concat(jsSrc).concat(lessSrc).concat(imgSrc).concat(wxmlSrc);

// gulp 需要ignore 的文件配置 
// TODO: issa 经过base64的所有图片都直接ignore
const ignoreJsList = ['!src/utils/test.js'];
const ignoreLessList = ['!src/styles/', '!src/styles/**', '!src/var.less'];
const ignoreImageList = ['!src/imgs/icon', '!src/imgs/icon/**'];
const ignoreWxmlList = [];
const ignoreJsonList = [];

const jsSource = jsSrc.concat(ignoreJsList);
const lessSource = lessSrc.concat(ignoreLessList);
const imageSource = imgSrc.concat(ignoreImageList);
const wxmlSource = wxmlSrc.concat(ignoreWxmlList);
const jsonSource = jsonSrc.concat(ignoreJsonList);

const dest = 'dist/';

gulp.task('clean', () => del(['dist/**']));

// 处理js 文件，包括eslint/babel/压缩
gulp.task('buildJs', ['clean'], () =>
  gulp.src(jsSource)
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
    .pipe(gulp.dest(dest)));

// 处理less文件
gulp.task('buildLess', ['clean'], () => gulp.src(lessSource)
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
  .pipe(gulp.dest(dest)));

// 处理图片
gulp.task('buildImage', ['clean'], () => gulp.src(imageSource)
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(imagemin())
  .pipe(gulp.dest(dest)));

// 处理wxml
gulp.task('buildWxml', ['clean'], () => gulp.src(wxmlSource)
  .pipe(plumber({
    errorHandler: (err) => {
      gutil.log(err.stack);
    },
  }))
  .pipe(gulpif(prod, htmlmin()))
  .pipe(gulp.dest(dest)));

gulp.task('build', ['clean', 'buildWxml', 'buildImage', 'buildLess', 'buildJs'], () => gulp.src(jsonSource)
  .pipe(gulp.dest(dest)));

gulp.task('watch', ['build'], () => watch(src, { debounceDelay: 200 }, (res) => {
  gulp.start('build');
  gutil.log(`File ${res.history} was ${res.event}, tasks running ...`);
}));

gulp.task('default', ['watch']);
