-------------------------
-------- INSTALL --------
-------------------------

1. устанавливаем http://nodejs.org/download/
2. пуск - выполнить cmd. все дальнейшие действия будут происходить в консоли
3. cmd -> npm install --global gulp
--------------------------
это нужно сделать один раз
--------------------------

1. копируем в папку с проектом шаблон
2. cmd -> cd /d путь_в_папку_с_проектом 
3. cmd -> npm i (на варнинги не обращаем внимание)
4. если используется структура проекта отличающаяся от исходного, в gulpfile.js заменить переменные с путями на необходимые.
5. cmd -> gulp
6. по окночанию работы - ctrl+c. подтвердить окончание "y".



-------------------------
--------- INFO ----------
-------------------------
1. собирается все через gulp. - https://github.com/gulpjs/gulp/
2. в качестве css препроцессора используется stylus. документация - http://learnboost.github.io/stylus/
3. вендорные префиксы проставляются постпроцессором autoprefixer - https://github.com/postcss/autoprefixer
4. спрайты генерируются с помощью spritesmith - https://github.com/twolfson/gulp.spritesmith статья на хабр - http://habrahabr.ru/post/227945/
!!!!!ВАЖНО!!!!!
папка ./src/sprites обязательно должа содержать хотя бы один файл для корректной работы. по этому в ней лежит spacer.png который не удалять
-------------------------------------------------------------------------------------------
	использование
	-------------
	1. картинки для спрайтов складываем в ./src/sprites они автоматически 
	   склеятся в ./public/images/sprite.png
	2. для использования в stylus есть следующие функции
		2.1 sprite($s-исходное_имя_картинки)
			базовая функция. вернет 
				background-image: url("../images/sprite.png");
				background-position: 0px 0px;
				width: 512px;
				height: 512px;
			пример использования 
				.class
					sprite($s-box)
		2.2 spriteImage($s-исходное_имя_картинки)
			вернет 
				background-image: url("../images/sprite.png");
			пример использования 
				.class
					spriteImage($s-box)
		2.3 spriteWidth($s-исходное_имя_картинки)
			вернет ширину картинки.
				width: 512px;
			пример использования 
				.class
					spriteImage($s-box)
					spriteWidth($s-box)
			или
				.class
					&:before
						content: ''
						position: absolute
						sprite($s-box)
						left: -(spriteWidth($s-box))
		2.4 spriteHeight($s-исходное_имя_картинки)
			вернет высоту картинки.
				height: 512px;
			пример использования 
				.class
					spriteImage($s-box)
					spriteHeight($s-box)
		2.5 spritePosition($s-исходное_имя_картинки)
			вернет высоту background-position.
				background-position: 0px 0px;
			пример использования 
				.class
					spriteImage($s-box)
					spritePosition($s-box)
		2.6 spriteUrl($s-исходное_имя_картинки)
			базовая функция. вернет 
				background: url(../images/sprite.png) 0px 0px  no-repeat;
			пример использования 
				.class
					spriteUrl($s-box)
5. изображения оптимизируются с помощью gulp-imagemin - https://github.com/sindresorhus/gulp-imagemin
!!!!!ВАЖНО!!!!!
папка ./src/images обязательно должа содержать хотя бы один файл для корректной работы. по этому в ней лежит spacer.png который не удалять
-------------------------------------------------------------------------------------------
6. минимизируем css стилусом
7. sourcemaps строим с помощью - https://github.com/floridoo/gulp-sourcemaps 
8. на тэг html автоматически добавляются классы в зависимости от устройства, оси, браузера
	desktop/mobile/tablet
	windows/ios/iphone/ipad/ipod/android/blackberry/fxos
	landscape/portait
	chrome/ie/firefox/safari/opera
	v38.0 








