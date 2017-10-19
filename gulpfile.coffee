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

gulp.task 'default', ['build-js', 'build-css']

gulp.task 'build-css', ->
  gulp.src './src/style/index.css'
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

gulp.task 'build-js', (cb) ->
  pump([
    rollup
      input: './src/script/index.js'
      format: 'iife'
    source('index.js')
    buffer()
    rename('lanyon.min.js')
    uglify()
    gulp.dest('./assets/js')
  ], cb)
  return
