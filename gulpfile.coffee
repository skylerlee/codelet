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

gulp.task 'default', ['build-css', 'build-js']

gulp.task 'build-css', ->
  gulp.src './src/style/enfield.css'
  .pipe rename('enfield.min.css')
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
      input: './src/script/enfield.js'
      format: 'iife'
    source('enfield.js')
    buffer()
    rename('enfield.min.js')
    uglify()
    gulp.dest('./assets/js')
  ], cb)
  return
