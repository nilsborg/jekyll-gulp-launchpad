var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require("del");
var browserSync = require('browser-sync').create();
var sass = require("gulp-sass");
var notify = require("gulp-notify");
var size = require("gulp-size");
var ghPages = require('gulp-gh-pages');

/**
 * Building Jekyll Site
 */

// Runs the build command for Jekyll to compile the site locally
// This will build the site with the production settings
gulp.task("jekyll:dev", shell.task("bundle exec jekyll build"));

gulp.task("jekyll-rebuild", ["jekyll:dev"], function () {
  browserSync.reload();
});

// Almost identical to the above task, but instead we load in the build configuration
// that overwrites some of the settings in the regular configuration so that you
// don"t end up publishing your drafts or future posts
gulp.task("jekyll:prod", ["styles"], shell.task("bundle exec jekyll build --config _config.yml,_config.prod.yml"));

// These tasks will look for files that change while serving and will auto-regenerate or
// reload the website accordingly. Update or add other files you need to be watched.
gulp.task("watch", function () {
  gulp.watch([
    "src/**/*.md",
    "src/**/*.html",
    "src/**/*.xml",
    "src/**/*.txt",
    "src/**/*.js"
  ], ["jekyll-rebuild"]);

  gulp.watch(["src/assets/scss/**/*.scss"], ["styles"]);
});

// BrowserSync will serve our site on a local server for us and other devices to use
// It will also autoreload across all devices as well as keep the viewport synchronized
// between them.
gulp.task("serve:dev", ["styles", "jekyll:dev"], function () {
  browserSync.init({
    notify: true,
    browser: "google chrome",
    server: {
      baseDir: "dev"
    }
  });
});


/**
 * Compiling SASS files
 */

gulp.task("styles", function () {
  // Looks at the style.scss file for what to include and creates a style.css file
  return gulp.src("src/assets/scss/screen.scss")
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .on('error', errorHandler)
    .on("error", notify.onError())
    .pipe(gulp.dest("src/assets/css/"))
    .pipe(gulp.dest("dev/assets/css/"))
    // Outputs the size of the CSS file
    .pipe(size({title: "styles"}))
    // Injects the CSS changes to your browser since Jekyll doesn"t rebuild the CSS
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Error handling on sass compilation for example
 */
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}


/**
 * Gulp workflow
 */

// Default task, run when just writing "gulp" in the terminal
gulp.task("default", ["serve:dev", "watch"]);

gulp.task('deploy', ["jekyll:prod"], function() {
  return gulp.src('./prod/**/*')
    .pipe(ghPages({
      branch: "gh-pages"
    }));
});
