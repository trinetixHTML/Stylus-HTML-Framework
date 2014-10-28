var gulp    = require('gulp'),
	stylus  = require('gulp-stylus'),
	postcss = require('gulp-postcss'),
    sprite  = require('gulp-sprite-generator'),
	autoprefixer = require('autoprefixer-core');


gulp.task('stylus', function () {
	gulp.src('./src/stylus/main.styl')
			.pipe(stylus())
			.on('error', console.log)
			.pipe(postcss([ autoprefixer({ browsers: [
				'> 1%',
				'last 2 versions',
				'ie > 7',
				'Firefox ESR',
				'Opera 12.1'
			] }) ]))
			.on('error', console.log)
			.pipe(gulp.dest('./public/css/'));
});

gulp.task('sprites', function() {
    var spriteOutput;
    spriteOutput = gulp.src("./public/css/*.css")
        .pipe(sprite({
		    baseUrl:         "./",
            spriteSheetName: "sprite.png",
            spriteSheetPath: "../images",
		    algorithm:       "binary-tree",
		    padding:         10
        }));
    spriteOutput.css.pipe(gulp.dest("./public/css"));
    spriteOutput.img.pipe(gulp.dest("./public/images"));
});


gulp.task('watch', function() {
	gulp.watch('./src/stylus/*.styl', ['stylus']);
	gulp.watch('./public/css/*.css',  ['sprites']);
});

gulp.task('default', [
	'watch',
	'stylus',
	'sprites'
]);
