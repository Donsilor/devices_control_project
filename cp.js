const fs = require("fs");
const path = require("path");

var mkdirp = require("./mkdirp.js");

var mkdir = function(dir) {
    // making directory without exception if exists
    try {
        if (!fs.existsSync(dir)) mkdirp(dir, function() {});
    } catch (e) {
        if (e.code != "EEXIST") {
            throw e;
        }
    }
};

var copyDir = function(src, dest) {
    mkdir(dest);
    var files = fs.readdirSync(src);
    for (var i = 0; i < files.length; i++) {
        var current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            var symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
};

var copy = function(src, dest) {
    var oldFile = fs.createReadStream(src);
    var newFile = fs.createWriteStream(dest);
    oldFile.pipe(newFile);
};

// fs.readdirSync(path.resolve(process.cwd)).forEach(function(file) {
//     console.log(file);
// });

copyDir("./src/weather/assets", "./lib/base/weather/assets");
