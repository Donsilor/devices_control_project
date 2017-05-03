var gulpDocumentation = require('gulp-documentation');
var gulp = require('gulp');
var config = require('./package.json');
gulp.task('web', function () {
    return gulp.src(['./apis/web/*.js'])
        .pipe(gulpDocumentation('html', {}, {
            name: 'JS-SDK for h5 control page',
            version: config.version
        }))
        .pipe(gulp.dest('dist/sdk-documentation-web'));
});

gulp.task('app', function () {
    return gulp.src(['./apis/web/*.js'])
        .pipe(gulpDocumentation('html', {}, {
            name: 'APP-SDK for h5 control page',
            version: config.version
        }))
        .pipe(gulp.dest('dist/sdk-documentation-app'));
});

gulp.task('watch', function () {
    gulp.watch(['./apis/*.js'], ['web', 'app']);
});
gulp.task('build',function () {
    gulp.run(['web','app']);
})