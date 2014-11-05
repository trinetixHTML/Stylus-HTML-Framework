// подключаем плагины
var     gulp         = require('gulp'),
		stylus       = require('gulp-stylus'),
		postcss      = require('gulp-postcss'),
		spritesmith  = require('gulp.spritesmith'),
		autoprefixer = require('autoprefixer-core'),
		imagemin     = require('gulp-imagemin'),
		sourcemaps = require('gulp-sourcemaps');

// переменные с путями
// пути к исходным файлам из который будет собираться
// стилус
var srcStyl  = 'src/stylus/';
// картинки
var srcImgs  = 'src/images/';
// спрайты
var srcSprts  = 'src/sprites/';
// пути к финальным вайлам
// цсс
var publCss  = 'public/css/';
// картинки
var publImgs = 'public/images/';



 // регестрируем задачи
 gulp.task('default', [
	'watch',
	'sprites',
	'stylus',
	'compress'
]);

// настраиваем слежение за изменениями
gulp.task('watch', function() {
	// следим за папкой sprites. если есть изменения - запускаем задачу 'sprites'
	gulp.watch(srcSprts+'*',        ['sprites']);
	// следим за папкой images. если есть изменения - запускаем задачу 'images'
	gulp.watch(srcImgs+'*',         ['compress']);
	// следим за папкой stylus. если есть изменения - запускаем задачу 'stylus'
	gulp.watch(srcStyl+'*.styl',    ['stylus']);
});


// оптимизация картинок
gulp.task('compress', function() {
	gulp.src(srcImgs+'*')
			.pipe(imagemin({
				progressive: true
			}))
			.pipe(gulp.dest(publImgs));
});

// генерим стилус
gulp.task('stylus', function () {
	// путь к главному файлу стилус в который будет все собираться
	gulp.src(srcStyl+'main.styl')
		// генерим
		.pipe(stylus({
			compress: true,
			sourcemap: {
				inline: true,
				sourceRoot: '.',
				basePath: publCss
			}
		}))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		// добавляем вендорные префиксы
		.pipe(postcss([ autoprefixer({ browsers: [
			'> 1%',
			'last 3 versions',
			'ie > 7',
			'Firefox ESR',
			'Opera 12.1'
		] }) ]))
		.pipe(sourcemaps.write('.', {
			includeConent: false,
			sourceRoot: '.'
		}))
		// сохраняем готовый цсс
		.pipe(gulp.dest(publCss));
});




// генерим спрайты
gulp.task('sprites', function () {
	// путь к папке где лежат иходные файлы из которых будет собираться спрайт
	var spriteData = gulp.src(srcSprts+'*').pipe(spritesmith({
		// имя итогового файла спрайта
		imgName:     'sprite.png',
		// формат файла в который будут генерироваться переменные с информацмей о спрайтах
		cssFormat:   'stylus',
		// файл стилуса в который будут генерироваться переменные с информацмей о спрайтах
		cssName:     '_sprite.styl',
		// алгоритм сборки - максимально компактно
		algorithm:   'binary-tree',
		// отступы между изображениями в спрайте
		padding:     10,
		// шаблон описывающий как будут генерироваться переменные с информацмей о спрайтах
		cssTemplate: 'stylus.template.mustache',
		// вид имени переменных с информацмей о спрайтах
		cssVarMap:   function(sprite) {
			sprite.name = 's-' + sprite.name
		}
	}));
	// сохраняем спрайт
	spriteData.img.pipe(gulp.dest(srcImgs));
	// сохраняем файл стилуса в который будут генерироваться переменные с информацмей о спрайтах
	spriteData.css.pipe(gulp.dest(srcStyl));
});



