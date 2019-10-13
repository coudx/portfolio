"use strict";

import gulp from "gulp";
import browserSync from "browser-sync";
import sass from "gulp-sass";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";
import plumber from "gulp-plumber";
import concat from "gulp-concat";
import rename from "gulp-rename";

var reload = browserSync.reload;

// use default task to launch Browsersync and watch JS files
gulp.task("sync", () => {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
});

// add browserSync.reload to the tasks array to make
// all browsers reload after tasks are complete.

// gulp.task("reload", done => {
//   browserSync.reload();
//   done;
// });

// Compile sass into CSS & auto-inject into browsers
gulp.task("css", function() {
  return gulp
    .src("assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: "node_modules"
      })
    )
    .on("error", sass.logError)
    .pipe(gulp.dest("assets/css"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

// process JS files and return the stream
gulp.task("js", function() {
  return gulp
    .src("assets/js/*.js")
    .pipe(concat("index.js"))
    .pipe(gulp.dest("js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/js"))
    .pipe(browserSync.stream());
});

gulp.task("watch", done => {
  gulp.watch("assets/scss/**/*", () => ["css"]);
  gulp.watch("assets/js/**/*", () => ["js"]);
  gulp.watch("**/*.html", () => ["reload"]);
});

gulp.task("build", gulp.parallel("css", "js"));
gulp.task("default", gulp.series("build", "sync", "watch"));
