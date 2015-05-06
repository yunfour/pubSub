

var gulp = require('gulp');

var del    = require('del'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    fs     = require('fs'),
    path   = require('path'),
    Buffer = require('buffer');

var paths = {
    scripts: [
        'src/**/*.js'
    ]
};


gulp.task('rename', function() {
    
    return gulp.src(paths.scripts)
               .pipe(rename(function(path) {
                   
                   path.basename += '-debug';
               }))
               .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    
    return gulp.src(paths.scripts)
               .pipe(uglify())
               .pipe(gulp.dest('dist'));
});


gulp.on('task_stop', function(ev) {
    
    if(ev.task !== 'default') {
        return;
    }
    
    var path = 'dist/';
    
    var distFiles = fs.readdirSync(path);
    
    var filePrefix = 'define(function(require, exports, module) {',
        fileSuffix = '});',
        lineBreak = '';
    
    for(var i = 0, l = distFiles.length, result, fileName, extName, fileData; i < l; i++) {
        
        fileName = distFiles[i];
        extName  = fileName.split('.');
        extName  = extName.length > 1 ? extName[extName.length - 1] : '';
        
        if(
            !fs.lstatSync(path + fileName).isFile() ||
            extName !== 'js'
        ) {
            
            continue;
        }
        
        if(fileName.indexOf('-debug.js') === fileName.length - 9) {
            lineBreak = '\n';
        } else {
            lineBreak = '';
        }
        
        fileData = fs.readFileSync(path + distFiles[i]);
        
        result = filePrefix + lineBreak + fileData.toString('utf-8') + lineBreak + fileSuffix;
        
        fs.writeFileSync(path + fileName, result);
    }
});

gulp.task('default', ['rename', 'uglify']);
