// подключаем плагины
var gulp         = require('gulp'),
	stylus       = require('gulp-stylus'),
	postcss      = require('gulp-postcss'),
	spritesmith  = require('gulp.spritesmith'),
	autoprefixer = require('autoprefixer-core');

// переменные с путями
// пути к исходным файлам из который будет собираться
// стилус
var srcStyl  = './src/stylus/';
// картинки
var srcImgs  = './src/images/';
// пути к финальным вайлам
// цсс
var publCss  = './public/css/';
// картинки
var publImgs = './public/images/';

// генерим стилус
gulp.task('stylus', function () {
	// путь к главному файлу стилус в который будет все собираться
	gulp.src(srcStyl+'main.styl')
			// генерим
			.pipe(stylus())
			// выводим ошибки
			.on('error', console.log)
			// добавляем вендорные префиксы
			.pipe(postcss([ autoprefixer({ browsers: [
				'> 1%',
				'last 2 versions',
				'ie > 7',
				'Firefox ESR',
				'Opera 12.1'
			] }) ]))
			// выводим ошибки
			.on('error', console.log)
			// сохраняем готовый цсс
			.pipe(gulp.dest(publCss));
});

// генерим спрайты
gulp.task('sprites', function () {
	// путь к папке где лежат иходные файлы из которых будет собираться спрайт
	var spriteData = gulp.src(srcImgs+'sprites/*').pipe(spritesmith({
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
	spriteData.img.pipe(gulp.dest(publImgs));
	// сохраняем файл стилуса в который будут генерироваться переменные с информацмей о спрайтах
	spriteData.css.pipe(gulp.dest(srcStyl));
});

// настраиваем слежение за изменениями
gulp.task('watch', function() {
	// следим за папкой sprites. если есть изменения - запускаем задачу 'sprites'
	gulp.watch(srcImgs+'/sprites/*', ['sprites']);
	// следим за папкой stylus. если есть изменения - запускаем задачу 'stylus'
	gulp.watch(srcStyl+'*.styl',     ['stylus']);
});

// регестрируем задачи.
// ВАЖНО
// -----
// порядок описывания задач задает порядок их запуска.
// то есть при запуске гранта сперва отработает спрайт, потом стилус, потом запустится слежение.
// в дальнейшем запуск задач будет зависить от очередности изменения описаных в 'watch'
// к примеру - добавилась картинка в папке 'sprites'. запутилась задача 'sprites'.
// в этой задаче есть перегенерация 'stylus'. соответственно после генерации запустится задача 'stylus'.
gulp.task('default', [
	'sprites',
	'stylus',
	'watch'
]);
