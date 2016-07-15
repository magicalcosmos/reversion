var gulp = require('gulp'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence  = require('gulp-run-sequence'),
    replace = require('gulp-replace'),
    through = require('through-gulp');

function RenameFileContent (opts){
    var mutables = [];
    return through(function (file, encoding, callback) {

        mutables.push(file);
        callback();

    }, function(callback){

        mutables.forEach(function (file){
            if (!file.isNull()) {
                var src = file.contents.toString('utf8');
                var  html = JSON.stringify(src).replace(opts.regex, opts.replacement);
                file.contents = new Buffer(JSON.parse(html));
            }

            this.push(file);

        }, this);

        callback();
    });
}
module.exports = RenameFileContent;

/************** borrow-webapp reversion start *******************/
var bRooDir = '../borrow-webapp/src/main/webapp',
    staticDir =  bRooDir + '/static',
    jspDir = bRooDir + '/WEB-INF/pages';

/********* 清除已生成的版本号 **************/
gulp.task('b-clean', function(){
    return gulp.src(['../borrow-webapp/src/main/webapp/static/**/*_**.css', '../borrow-webapp/src/main/webapp/static/**/*_**.js'], {read : false}).pipe(clean({force : true}));
});
/********* 为css生MD5版本号 **************/
gulp.task('b-css', function(){
    return gulp.src(staticDir + '/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest(staticDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./css/rev/borrow'))
});

/********* 为jsp添加css版本号 **************/
gulp.task('b-remove-css', function(){
    return gulp.src(jspDir + '/**/*.jsp')
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.css', 'g'),
            replacement : '.css'
        }))
        .pipe(gulp.dest(jspDir))
});

/********* 为jsp添加css版本号 **************/
gulp.task('b-replace-css', ['b-css', 'b-remove-css'], function(){
    return gulp.src(['./css/rev/borrow/rev-manifest.json', jspDir + '/**/*.jsp'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.css'
        }))
        .pipe(gulp.dest(jspDir))
});


/********* 为js生MD5版本号 **************/
gulp.task('b-js', function(){
    return gulp.src(staticDir + '/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest(staticDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./js/rev/borrow'))
});

/********* 为js移除js版本号 **************/
gulp.task('b-remove-js', function(){
    return gulp.src([ staticDir + '/**/*.js'])
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.js', 'g'),
            replacement : '.js'
        }))
        .pipe(gulp.dest(staticDir))
});
/********* 为jsp移除js版本号 **************/
gulp.task('b-remove-js-jsp', function(){
    return gulp.src(jspDir + '/**/*.jsp')
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.js', 'g'),
            replacement : '.js'
        }))
        .pipe(gulp.dest(jspDir))
});
/********* 为js添加js版本号 **************/
gulp.task('b-js-replace-js', ['b-remove-js'], function(){
    return gulp.src(['./js/rev/borrow/rev-manifest.json', staticDir + '/**/*.js'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.js'
        }))
        .pipe(gulp.dest(staticDir))
});

/********* 为jsp添加js版本号 **************/
gulp.task('b-js-replace-jsp', ['b-remove-js-jsp'], function(){
    return gulp.src(['./js/rev/borrow/rev-manifest.json', jspDir + '/**/*.jsp'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.js'
        }))
        .pipe(gulp.dest(jspDir))
});

gulp.task('b-replace-js', ['b-js'], function(){
    runSequence ('b-js-replace-js',  'b-js-replace-jsp');
})

gulp.task('rev-borrow',['b-clean'], function(){
    runSequence ('b-replace-css', 'b-replace-js');
});
gulp.task('rev-b', ['rev-borrow'], function(){
    gulp.start('rev-borrow');
});
/************** borrow-webapp reversion end *******************/


/************** rent-webapp reversion start *******************/
var rRooDir = '../rent-webapp/src/main/webapp',
    rStaticDir =  rRooDir + '/static',
    rJspDir = rRooDir + '/WEB-INF/pages';

/********* 清除已生成的版本号 **************/
gulp.task('r-clean', function(){
    return gulp.src(['../rent-webapp/src/main/webapp/static/**/*_**.css', '../rent-webapp/src/main/webapp/static/**/*_**.js'], {read : false}).pipe(clean({force : true}));
});
/********* 为css生MD5版本号 **************/
gulp.task('r-css', function(){
    return gulp.src(rStaticDir + '/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest(rStaticDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./css/rev/rent'))
});

/********* 为jsp添加css版本号 **************/
gulp.task('r-remove-css', function(){
    return gulp.src(rJspDir + '/**/*.jsp')
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.css', 'g'),
            replacement : '.css'
        }))
        .pipe(gulp.dest(rJspDir))
});

/********* 为jsp添加css版本号 **************/
gulp.task('r-replace-css', ['r-css', 'r-remove-css'], function(){
    return gulp.src(['./css/rev/rent/rev-manifest.json', rJspDir + '/**/*.jsp'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.css'
        }))
        .pipe(gulp.dest(rJspDir))
});


/********* 为js生MD5版本号 **************/
gulp.task('r-js', function(){
    return gulp.src(rStaticDir + '/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest(rStaticDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./js/rev/rent'))
});

/********* 为js移除js版本号 **************/
gulp.task('r-remove-js', function(){
    return gulp.src([rStaticDir + '/**/*.js'])
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.js', 'g'),
            replacement : '.js'
        }))
        .pipe(gulp.dest(rStaticDir))
});
/********* 为jsp移除js版本号 **************/
gulp.task('r-remove-js-jsp', function(){
    return gulp.src(rJspDir + '/**/*.jsp')
        .pipe(RenameFileContent({
            regex : new RegExp('_[0-9a-f]{8,10}.js', 'g'),
            replacement : '.js'
        }))
        .pipe(gulp.dest(rJspDir))
});
/********* 为js添加js版本号 **************/
gulp.task('r-js-replace-js', ['r-remove-js'], function(){
    return gulp.src(['./js/rev/rent/rev-manifest.json', rStaticDir + '/**/*.js'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.js'
        }))
        .pipe(gulp.dest(rStaticDir))
});

/********* 为jsp添加js版本号 **************/
gulp.task('r-js-replace-jsp', ['r-remove-js-jsp'], function(){
    return gulp.src(['./js/rev/rent/rev-manifest.json', rJspDir + '/**/*.jsp'])
        .pipe(revCollector({
            replaceReved : false,
            suffix : '.js'
        }))
        .pipe(gulp.dest(rJspDir))
});

gulp.task('r-replace-js', ['r-js'], function(){
    runSequence ('r-js-replace-js',  'r-js-replace-jsp');
})

gulp.task('rev-rent',['r-clean'], function(){
    runSequence ('r-replace-css', 'r-replace-js');
});
gulp.task('rev-r', ['rev-rent'], function(){
    gulp.start('rev-rent');
});

/************** rent-webapp reversion end *******************/



/************** product reversion task start *******************/

//add md5 to all js and jsp
gulp.task('rev', function(){
    runSequence('rev-b', 'rev-r');
});

//remove md5 from jsp
gulp.task('ojsp', function(){
    runSequence ('b-remove-js-jsp',  'b-remove-css', 'r-remove-js-jsp',  'r-remove-css');
});

//remove md5 from js
gulp.task('ojs', function(){
    runSequence ('b-remove-js', 'r-remove-js');
});

//remove md5 from js and jsp and remove all files which have md5;
gulp.task('clean', ['b-clean', 'r-clean'], function(){
    runSequence ('ojs', 'ojsp');
});
/************** product reversion task end *******************/
