//严格模式
"use static";

var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");
var del = require("del");

var $ = gulpLoadPlugins();

gulp.task("styles", function() {
    return gulp.src("app/styles/*.scss")
        .pipe($.plumber())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe(gulp.dest("dist/styles"));
});

gulp.task("scripts", function() {
    return gulp.src("app/scripts/**/*.js")
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest("dist/scripts"));
});

gulp.task("jshint", function() {
    return gulp.src("app/scripts/**/*.js")
        .pipe($.jshint())
        .pipe($.jshint.reporter("jshint-stylish"))
        .pipe($.jshint.reporter("fail"));
});

gulp.task("cssmin", ['styles'], function() {
    return gulp.src("dist/styles/*.css")
        .pipe($.cssnano({ safe: true, autoprefixer: false }))
        .pipe(gulp.dest('dist2/styles'));
})

gulp.task("jsmin", [/*"jshint",*/ "scripts"], function() {
    return gulp.src("dist/scripts/**/*.js")
        .pipe($.uglify())
        .pipe(gulp.dest("dest2/scripts"));
});

gulp.task("imagesmin", function() {
    return gulp.src("app/images/**/*")
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ cleanupIDs: false }]
        })))
        .pipe(gulp.dest("dist2/images"));
});

gulp.task("watch", function() {
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
});

gulp.task("clean", del.bind(null, ['dist', 'dist2']));

gulp.task("build", [/*"jshint",*/ "cssmin", "jsmin", "imagesmin"], function() {
    return gulp.src('dist2/**/*').pipe($.size({ title: 'build', gzip: true }));
})


gulp.task("default",["clean"],function(){
	gulp.start("build");
});
