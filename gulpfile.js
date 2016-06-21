//严格模式
"use static";

var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");
var del = require("del");

var $ = gulpLoadPlugins();

gulp.task("styles", function() {
    return gulp.src("app/common/curise-nav/scss/*.scss")
        .pipe($.plumber())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe(gulp.dest("dist/common/curise-nav/styles"));
});

gulp.task("scripts", function() {
    return gulp.src("app/common/curise-nav/scripts/**/*.js")
        .pipe($.plumber())
        .pipe($.babel())
        //.pipe($.concat("t.js"))
        .pipe(gulp.dest("dist/common/curise-nav/scripts"));
});

gulp.task("jshint", function() {
    return gulp.src("app/common/curise-nav/scripts/**/*.js")
    //return gulp.src(["app/common/curise-nav/scripts/common-nav.3.0.js"])
        .pipe($.jshint())
        .pipe($.jshint.reporter("default"))
        //.pipe($.jshint.reporter("jshint-stylish"))
        .pipe($.jshint.reporter("fail"));
});

gulp.task("jsconcat", ["scripts"], function() {
    return gulp.src(["app/common/curise-nav/scripts/a.js", "app/common/curise-nav/scripts/b.js", "app/common/curise-nav/scripts/c.js", "app/common/curise-nav/scripts/d.js"])
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.concat("common-nav.3.1.js", { newLine: ';' }))
        .pipe(gulp.dest("dist/common/curise-nav/scripts"));
})

gulp.task("cssmin", ['styles'], function() {
    return gulp.src("dist/common/curise-nav/styles/*.css")
        .pipe($.cssnano({ safe: true, autoprefixer: false }))
        .pipe(gulp.dest('dist2/common/curise-nav/styles'));
})

gulp.task("jsmin", [ /*"jshint",*/ "jsconcat"], function() {
    return gulp.src("dist/common/curise-nav/scripts/**/*.js")
        .pipe($.uglify())
        .pipe(gulp.dest("dist2/common/curise-nav/scripts"));
});

gulp.task("imagesmin", function() {
    return gulp.src("app/common/curise-nav/images/**/*")
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ cleanupIDs: false }]
        })))
        .pipe(gulp.dest("dist2/common/curise-nav/images"));
});

gulp.task("watch", function() {
    gulp.watch('app/common/curise-nav/scss/**/*.scss', ['styles']);
    gulp.watch('app/common/curise-nav/scripts/**/*.js', ['jsconcat']);
});

gulp.task("clean", del.bind(null, ['dist', 'dist2']));

gulp.task("build", [ /*"jshint",*/ "cssmin", "jsmin", "imagesmin"], function() {
    return gulp.src('dist2/**/*').pipe($.size({ title: 'build', gzip: true }));
})


gulp.task("default", ["clean","build"], function() {
    //gulp.start("build");
});
