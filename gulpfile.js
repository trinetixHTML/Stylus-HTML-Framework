// подключаем плагины
var     gulp         = require('gulp'),
		stylus       = require('gulp-stylus'),
		postcss      = require('gulp-postcss'),
		spritesmith  = require('gulp.spritesmith'),
		autoprefixer = require('autoprefixer-core'),
		imagemin     = require('gulp-imagemin'),
		newer        = require('gulp-newer'),
		sourcemaps   = require('gulp-sourcemaps');

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
			.pipe(newer(publImgs))
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
			// минимизируем
			compress: true,
			// инициализируем карту
			sourcemap: {
				inline: true,
				sourceRoot: '.',
				basePath: publCss
			}
		}))
		// строим карту
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		// добавляем вендорные префиксы
		.pipe(postcss([
			opacity,
			autoprefixer({ browsers: [
				'> 1%',
				'last 3 versions',
				'ie > 7',
				'Firefox ESR',
				'Opera 12.1'
			] })
		]))
		// записываем карту
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


function rgba2hex(rgba) {
	rgba = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + (rgba[4]*100) + hex(rgba[1]) + hex(rgba[2]) + hex(rgba[3]);
}

// прозрачность для ие
var opacity = function(css) {
	css.eachDecl(function(decl, i) {
		if (decl.prop === 'opacity') {
			decl.parent.insertAfter(i, {
				prop: '-ms-filter',
				value: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (parseFloat(decl.value) * 100) + ')"'
			});
		}
		if (decl.prop === 'background-color') {
			var str = decl.value;
			if(str.indexOf('rgba(') + 1) {
				var colorHex = rgba2hex(str);
				decl.parent.insertAfter(i, {
					prop: '-ms-filter',
					value: '"progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=\''+colorHex+'\', EndColorStr=\''+colorHex+'\')"'
				});
			}
		}
	});
};

