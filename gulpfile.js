(function() {
  'use strict';

  var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    _paths = ['server.js', 'app/**/*.js', 'public/**/*.(html|css|js)'];


  //register nodemon task - this runs the app
  gulp.task('nodemon', function() {
    nodemon({
      script: 'server.js',
      env: {
        'NODE_ENV': 'development'
      }
    })
      .on('restart');
  });

  // Rerun the task when a file changes
  gulp.task('watch', function() {
    livereload.listen();
    watch(_paths, livereload.changed);
  });

  //lint js files
  gulp.task('lint', function() {
    gulp.src(_paths)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });


  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['lint', 'nodemon', 'watch']);

}());
