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
    gulp.src(['./src/sdk/hdsmart/**/*.js']).pipe(jsdoc(option, cb))
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
    gulp.watch(['./src/sdk/hdsmart/**/*.js'], ['web']);
});
gulp.task('build',function () {
    gulp.run(['web','app']);
});