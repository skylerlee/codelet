const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pump = require('pump');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

gulp.task('build-css', () =>
  gulp.src('./src/style/enfield.css')
  .pipe(rename('enfield.min.css'))
  .pipe(postcss([
    atImport(),
    autoprefixer({
      browsers: [
        '> 0.1%',
        'not ie <= 8',
      ]
    }),
    cssnano(),
  ]))
  .pipe(gulp.dest('./assets/css'))
);

gulp.task('build-js', (cb) =>
  pump([
    rollup({
      input: './src/script/enfield.js',
      format: 'iife',
    }),
    source('enfield.js'),
    buffer(),
    rename('enfield.min.js'),
    uglify(),
    gulp.dest('./assets/js'),
  ], cb)
);

exports.default = gulp.parallel(['build-css', 'build-js']);
