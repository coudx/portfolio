"use strict";

import gulp from "gulp";
import browsersync from "browser-sync";
import sass from "gulp-sass";
import minify from "gulp-minify";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import rename from "gulp-rename";
import del from "del";
import autoprefixer from "gulp-autoprefixer";

// use default task to launch Browsersync and watch JS files
// gulp.task("sync", done => {
let sync = done => {
  // Serve files from the root of this project
  browsersync.init({
    server: { baseDir: "./" },
    port: 3000
  });
  done();
};

// add browserSync.reload to the tasks array to make
// all browsers reload after tasks are complete.

// gulp.task("reload", done => {
let reload = done => {
  browsersync.reload();
  done();
};

// Compile sass into CSS & auto-inject into browsers
// gulp.task("css", function() {
let css = () => {
  return gulp
    .src("assets/css/style.css")
    .pipe(minify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("assets/css"))
    .pipe(browsersync.stream());
};

// process JS files and return the stream
// gulp.task("js", function() {
let js = () => {
  return (
    gulp
      // .src(["assets/js/*.js", "!assets/js/concat.js", "!assets/js/concat.min.js"])
      .src("assets/js/custom.js")
      // .pipe(concat("concat.js"))
      // .pipe(gulp.dest("assets/js"))
      .pipe(uglify())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("assets/js"))
      .pipe(browsersync.stream())
  );
};

// gulp.task("watchFiles", done => {
let watch = done => {
  gulp.watch("assets/css/style.css", css);
  gulp.watch(["assets/js/**/*", "!assets/js/custom.min.js"], js);
  gulp.watch("**/*.html", reload);
};

// gulp.task("build", gulp.parallel("css", "js"));
// gulp.task("default", gulp.series("build", gulp.parallel("sync", "watchFiles")));
let build = gulp.parallel(css, js);
let start = gulp.series(build, gulp.parallel(watch, sync));

export { css, js, sync, build, watch, start as default };
