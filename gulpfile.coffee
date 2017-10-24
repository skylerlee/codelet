gulp = require 'gulp'
rename = require 'gulp-rename'
postcss = require 'gulp-postcss'
atImport = require 'postcss-import'
autoprefixer = require 'autoprefixer'
cssnano = require 'cssnano'
pump = require 'pump'
rollup = require 'rollup-stream'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
uglify = require 'gulp-uglify'

gulp.task 'default', ['build-css', 'build-main', 'build-utils']

gulp.task 'build-css', ->
  gulp.src './src/style/lanyon.css'
  .pipe rename('lanyon.min.css')
  .pipe postcss([
    atImport()
    autoprefixer
      browsers: [
        '> 0.1%'
        'not ie <= 8'
      ]
    cssnano()
  ])
  .pipe gulp.dest('./assets/css')

gulp.task 'build-main', (cb) ->
  pump([
    rollup
      input: './src/script/lanyon.js'
      format: 'iife'
    source('lanyon.js')
    buffer()
    rename('lanyon.min.js')
    uglify()
    gulp.dest('./assets/js')
  ], cb)
  return

gulp.task 'build-utils', (cb) ->
  pump([
    rollup
      input: './src/script/utils.js'
      format: 'amd'
    source('utils.js')
    buffer()
    rename('utils.min.js')
    uglify()
    gulp.dest('./assets/js')
  ], cb)
  return
