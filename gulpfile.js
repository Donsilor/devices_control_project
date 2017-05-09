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
            systemName:'Web SDK Document'
        },
        opts: {
            destination: './dist/document-web'
        }
    });
    gulp.src(['./src/sdk/hdsmart/**/*.js']).pipe(jsdoc(option, cb))
});

gulp.task('app', function (cb) {
    let option = Object.assign({}, jsdocOptions, {
        templates:{
            systemName:'App SDK Document'
        },
        opts: {
            destination: './dist/document-app'
        }
    });
    gulp.src(['./src/__global_iot_proxy/sdk/**/*.js','./src/__global_iot_proxy/sdk/*.js']).pipe(jsdoc(option, cb))
});


gulp.task('watch', function () {
    gulp.watch(['./src/sdk/hdsmart/**/*.js'], ['web']);
    gulp.watch(['./src/__global_iot_proxy/sdk/**/*.js','./src/__global_iot_proxy/sdk/*.js'],['app']);
});
gulp.task('build',function () {
    gulp.run(['web','app']);
});