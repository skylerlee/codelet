gulp = require 'gulp'

gulp.task 'default', ['build-js', 'build-css']

gulp.task 'build-css', ->
  console.log 'Build css'

gulp.task 'build-js', ->
  console.log 'Build js'
