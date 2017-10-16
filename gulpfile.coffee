gulp = require 'gulp'
postcss = require 'gulp-postcss'
atImport = require 'postcss-import'
cssnano = require 'cssnano'

gulp.task 'default', ['build-js', 'build-css']

gulp.task 'build-css', ->
  gulp.src './src/style/index.css'
  .pipe postcss([
    atImport(),
    cssnano()
  ])
  .pipe gulp.dest('./assets/css')

gulp.task 'build-js', ->
  console.log 'Build js'
