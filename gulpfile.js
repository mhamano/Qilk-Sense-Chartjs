var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean-css');
var autoprefixer = require("gulp-autoprefixer");
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var del = require('del');
var zip = require('gulp-zip');
var plumber = require("gulp-plumber");
var rimraf = require('rimraf');
var htmlmin = require('gulp-htmlmin');

var config = require('./config.json');

gulp.task('clean:dist', function(cb) {
  rimraf('./dist/*', cb);
  console.log('Clean dist dir task completed');
});

gulp.task('clean:ext_dir', function(cb) {
  rimraf(config.extension_dir + '*', cb);
  console.log('Clean extension dir task completed');
});

gulp.task('clean:all', ['clean:dist', 'clean:ext_dir'], function() {
  console.log('Clean all task completed');
});

gulp.task('delete:ext_dir', function(cb){
  rimraf(config.extension_dir , cb);
});

gulp.task('js:root', function() {
  gulp.src('./src/*.js')
  .pipe(plumber())
  //.pipe(concat( extension_name + '.js'))
  //.pipe(uglify())
  .pipe(gulp.dest('./dist'))
  .pipe(gulp.dest(config.extension_dir));
});

gulp.task('js:root:uglify', function() {
  gulp.src('./src/*.js')
  .pipe(plumber())
  //.pipe(concat( extension_name + '.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'))
  .pipe(gulp.dest(config.extension_dir));
});

gulp.task('js:lib', function() {
  gulp.src('./src/lib/js/*.js')
  .pipe(plumber())
  //.pipe(concat( extension_name + '.js'))
  //.pipe(uglify())
  .pipe(gulp.dest('./dist/lib/js/'))
  .pipe(gulp.dest(config.extension_dir + 'lib/js/'));
});

gulp.task('js:lib:uglify', function() {
  gulp.src('./src/lib/js/*.js')
  .pipe(plumber())
  //.pipe(concat( extension_name + '.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/lib/js/'))
  .pipe(gulp.dest(config.extension_dir + 'lib/js/'));
});

gulp.task('less', function() {
  gulp.src('./src/lib/less/_root.less')
  .pipe(plumber())
  .pipe(concat('style.css'))
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(clean())
  .pipe(gulp.dest('./dist/lib/css/'))
  .pipe(gulp.dest(config.extension_dir + 'lib/css/'));
});

gulp.task('html', function() {
  gulp.src('./src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./dist'))
  .pipe(gulp.dest(config.extension_dir));
});

gulp.task('images:root', function() {
  gulp.src('./src/*.+(jpg|jpeg|png|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/'))
  .pipe(gulp.dest(config.extension_dir));
});

gulp.task('images:lib', function() {
  gulp.src('./src/lib/images/*.+(jpg|jpeg|png|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/lib/images/'))
  .pipe(gulp.dest(config.extension_dir + 'lib/images/'));
});

gulp.task('qext', function() {
  gulp.src('./src/*.qext')
  .pipe(plumber())
  .pipe(gulp.dest('./dist'))
  .pipe(gulp.dest(config.extension_dir));
});

gulp.task('zip:dev', function() {
  gulp.src(['./dist/*', './dist/lib/*', './dist/lib/css/*', './dist/lib/js/*'], {base: 'dist'})
  .pipe(zip(config.extension_name + '_dev.zip'))
  .pipe(gulp.dest('./build/dev/'))
});

gulp.task('zip:release', function() {
  gulp.src(['./dist/*', './dist/lib/*', './dist/lib/css/*', './dist/lib/js/*'], {base: 'dist'})
  .pipe(zip(config.extension_name + '_' + config.package_version + '.zip'))
  .pipe(gulp.dest('./build/release/'))
});

gulp.task('build',  ['js:root:uglify', 'js:lib:uglify', 'qext', 'less', 'html', 'images:root', 'images:lib'], function() {
  console.log("Default task completed.");
});

gulp.task('default',  ['js:root', 'js:lib', 'qext', 'less', 'html', 'images:root', 'images:lib'], function() {
  console.log("Default task completed.");
});

gulp.task('release', ['zip:dev','zip:release'], function() {
  console.log("Release task completed.");
});

gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['js:root']);
  gulp.watch('./src/lib/js/*.js', ['js:lib']);
  gulp.watch('./src/lib/less/*.less', ['less']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/*.+(jpg|jpeg|png|gif|svg)', ['images:root']);
  gulp.watch('./src/lib/images/*.+(jpg|jpeg|png|gif|svg)', ['images:lib']);
  gulp.watch('./src/*.qext', ['qext']);
});

gulp.task('watch:uglify', function() {
  gulp.watch('./src/*.js', ['js:root']);
  gulp.watch('./src/lib/js/*.js', ['js:lib']);
  gulp.watch('./src/lib/less/*.less', ['less']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/*.+(jpg|jpeg|png|gif|svg)', ['images:root']);
  gulp.watch('./src/lib/images/*.+(jpg|jpeg|png|gif|svg)', ['images:lib']);
  gulp.watch('./src/*.qext', ['qext']);
});
