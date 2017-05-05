// var gulpDocumentation = require('gulp-documentation');
// var gulp = require('gulp');
// var config = require('./package.json');
// gulp.task('web', function () {
//     return gulp.src(['./apis/web/*.js'])
//         .pipe(gulpDocumentation('html', {}, {
//             name: 'Web Sdk',
//             version: config.version
//         }))
//         .pipe(gulp.dest('dist/sdk-documentation-web'));
// });
//
// gulp.task('app', function () {
//     return gulp.src(['./apis/app/*.js'])
//         .pipe(gulpDocumentation('html', {}, {
//             name: 'App Sdk',
//             version: config.version
//         }))
//         .pipe(gulp.dest('dist/sdk-documentation-app'));
// });
//
// gulp.task('watch', function () {
//     gulp.watch(['./apis/**/*.js'], ['web', 'app']);
// });
// gulp.task('build',function () {
//     gulp.run(['web','app']);
// })

var jsdoc = require('gulp-jsdoc3');
var gulp = require('gulp');

var jsdocOptions = {
    "tags": {
        "allowUnknownTags": true
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "default": {
            "outputSourceFiles": true
        },
        "path": "ink-docstrap",
        "theme": "cerulean",
        "navType": "vertical",
        "linenums": true,
        "dateFormat": "MMMM Do YYYY, h:mm:ss a"
    }
};

gulp.task('web', function (cb) {
    let option = Object.assign({}, jsdocOptions, {
        templates:{
            systemName:'Web SDK'
        },
        opts: {
            destination: './dist/web-document'
        }
    });
    gulp.src(['./src/sdk/assets/hd.sdk.js']).pipe(jsdoc(option, cb))
});

gulp.task('app', function (cb) {
    // let option = Object.assign({}, jsdocOptions, {
    //     opts: {
    //         destination: './dist/app-document'
    //     }
    // });
    // gulp.src(['./src/sdk-document/app/*.js']).pipe(jsdoc(option, cb))
});


gulp.task('watch', function () {
    gulp.watch(['./src/sdk/assets/hd.sdk.js'], ['web', 'app']);
});
gulp.task('build',function () {
    gulp.run(['web','app']);
})