var gulp         = require('gulp'),
	stylus       = require('gulp-stylus'),
	postcss      = require('gulp-postcss'),
	spritesmith  = require('gulp.spritesmith'),
	autoprefixer = require('autoprefixer-core');

var srcStyl  = './src/stylus/';
var srcImgs  = './src/images/';
var publCss  = './public/css/';
var publImgs = './public/images/';

gulp.task('stylus', function () {
	gulp.src(srcStyl+'main.styl')
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
			.pipe(gulp.dest(publCss));
});


gulp.task('sprites', function () {
	var spriteData = gulp.src(srcImgs+'sprites/*').pipe(spritesmith({
		imgName:     'sprite.png',
		cssName:     '_sprite.styl',
		cssFormat:   'stylus',
		algorithm:   'binary-tree',
		padding:     10,
		cssTemplate: 'stylus.template.mustache',
		cssVarMap:   function(sprite) {
			sprite.name = 's-' + sprite.name
		}
	}));
	spriteData.img.pipe(gulp.dest(publImgs));
	spriteData.css.pipe(gulp.dest(srcStyl));
});


gulp.task('watch', function() {
	gulp.watch(srcImgs+'/sprites/*', ['sprites']);
	gulp.watch(srcStyl+'*.styl',     ['stylus']);
});

gulp.task('default', [
	'sprites',
	'stylus',
	'watch'
]);
