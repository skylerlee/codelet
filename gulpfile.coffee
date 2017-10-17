gulp = require 'gulp'
rename = require 'gulp-rename'
postcss = require 'gulp-postcss'
atImport = require 'postcss-import'
cssnano = require 'cssnano'
rollup = require 'rollup-stream'
source = require 'vinyl-source-stream'

gulp.task 'default', ['build-js', 'build-css']

gulp.task 'build-css', ->
  gulp.src './src/style/index.css'
  .pipe rename('lanyon.min.css')
  .pipe postcss([
    atImport(),
    cssnano()
  ])
  .pipe gulp.dest('./assets/css')

gulp.task 'build-js', ->
  rollup
    input: './src/script/index.js'
    format: 'iife'
  .pipe source('index.js')
  .pipe rename('lanyon.min.js')
  .pipe gulp.dest('./assets/js')
