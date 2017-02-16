const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require("del");
const browserSync = require('browser-sync').create();
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const size = require("gulp-size");
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const bust = require('gulp-buster');


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
gulp.task("jekyll:prod", ["cachebust"], shell.task("bundle exec jekyll build --config _config.yml,_config.prod.yml"));

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

gulp.task("styles:prod", function () {
  return gulp.src("src/assets/scss/*.scss")
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest("src/assets/css/"))
    .pipe(size({title: "styles"}));
});

/**
 * Cache busting
 */
gulp.task("cachebust", ["styles:prod"], function() {
  return gulp.src([
    "src/assets/css/screen.css",
    "src/assets/**/*.js"
  ])
    .pipe(bust({ relativePath: 'src/assets/' }))
    .pipe(gulp.dest('src/_data/'));
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

gulp.task("build:prod", ["jekyll:prod"]);
