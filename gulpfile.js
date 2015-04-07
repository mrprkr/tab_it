var gulp 					= require('gulp');
var bower 				= require('gulp-bower');
var sass 					= require('gulp-sass');
var notify 				= require('gulp-notify');
var jade					= require('gulp-jade');
// var browserSync 	= require('browser-sync');
var templateCache = require ('gulp-angular-templatecache');
var streamqueue 	= require('streamqueue');
// var modRewrite  = require('connect-modrewrite');
// var middleware = require('middleware');
// var reload 				= browserSync.reload;

gulp.task('jade', function(){
	var j = jade({
		pretty: true
	});
	j.on('error', function(err){
		console.log(err);
		notify().write("jade error");
		j.end();
		gulp.watch();
	})
	return gulp.src('./src/jade/*.jade')
	.pipe(j)
	.pipe(gulp.dest('./src/views/'))
})

//compule the HTML views to a templatecache file for angular
gulp.task('views',['jade'], function(){
 return streamqueue({ objectMode: true },
    gulp.src('./src/views/**/*.html')
    )
    .pipe(templateCache('./temp/templateCache.js', { module: 'templatescache', standalone: true }))
    .pipe(gulp.dest('./src/js/'));
});


//move the index file to the root of public
gulp.task('index', ['views'], function(){
	return gulp.src('./src/html/index.html')
		.pipe(gulp.dest('./public'))
})


//move scripts to the public scripts folder
gulp.task('scripts', ['index'], function(){
	return streamqueue({ objectMode: true },
		gulp.src('./src/js/angular-app.js'),
		gulp.src('./src/js/data.js'),
		gulp.src('./src/js/temp/templateCache.js')
		)
		.pipe(gulp.dest('./public/assets/js/'));
});


//compile scss to css
gulp.task('sass', ['scripts'], function(){
	return gulp.src('./src/scss/*.scss')
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: false,
			onError: function(err){
				return notify().write(err);
			}
		}))
		.pipe(gulp.dest('./public/assets/css/'));
});


gulp.task('build',['sass'], function(){
	console.log('build complete')
})


//compile on change
gulp.task('watch', function(){
	gulp.watch(['./src/scss/*.scss','./src/js/*.js', './src/html/*.html', './src/jade/*.jade', './src/views/*.html'], ['build']);
});

gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest('./public/assets/lib/'));
});


//serve to the browser
// gulp.task('serve', function(){
// 	browserSync({
// 		server: {
// 			baseDir: "./public",
// 			middleware: [
//                 modRewrite([
//                     '!\\.\\w+$ /index.html [L]'
//                 ])
//             ]
// 		},
// 		open: false
// 	})
// });

//the dafault task
gulp.task('default', ['watch', 'build', 'bower']);

