var gulp 		 = require('gulp'),
	sass         = require('gulp-sass'),
	plumber		 = require('gulp-plumber'),
	uglify       = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),	
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	sourcemaps   = require('gulp-sourcemaps'),
	imagemin     = require('gulp-imagemin'),
	webp 		 = require('gulp-webp'),
	svgstore 	 = require("gulp-svgstore"),
	posthtml 	 = require("gulp-posthtml"),
	include 	 = require("posthtml-include"),
	gcmq 		 = require('gulp-group-css-media-queries'),
	rigger       = require('gulp-rigger'),
	del          = require('del'),
	server  	 = require('browser-sync').create();


//__________path
var	devPath = {
	src: 'develop',	
	html: {
		src: '/*.html',
		dest: '/'		
	},
	css: {
		src: '/scss/style.scss',
		dest: '/css'
	},
	cssLibs: {
		src: '/scss-libs',
		dest: '/css'
	},
	js: {
		src: '/js/index.js',
		dest: '/js'
	},	
	jsLibs: {
		src: '/js-libs'
	},
	img: {
		src: '/img/**/*',
		dest: '/img'
	},
	fonts: '/fonts/**/*'
};	

var	prodPath = {
	src: 'production',
	css: '/css',
	js: '/js',
	img: '/img',
	fonts: '/fonts'
};


//____________________watch
gulp.task('default', ['watch']);

gulp.task('watch', ['sass', 'scripts'], function() {
	server.init({
	    server: devPath.src,
	    notify: false,
	    open: true,
	    cors: true,
	    ui: false
	});

	gulp.watch(devPath.src + devPath.css.src, ['sass']);
	gulp.watch(devPath.src + devPath.html.src, server.reload);
	gulp.watch(devPath.src + devPath.js.src, server.reload);
});


gulp.task('sass', function() {
	gulp.src([
		devPath.src + devPath.css.src,
		//devPath.src + devPath.cssLibs.src + '/custom-bootstrap.scss',
		//devPath.src + devPath.cssLibs.src + '/slick.scss'
		])
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: false }))
	.pipe(sourcemaps.write())
	.pipe(gcmq())
	.pipe(gulp.dest(devPath.src + devPath.css.dest))
	.pipe(server.reload({stream: true}))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(devPath.src + devPath.css.dest))
	.pipe(server.reload({stream: true}));	
});


gulp.task('scripts', function() {
	return gulp.src(devPath.src + devPath.js.src)
	.pipe(uglify())
	.pipe(rename({suffix: '.min'})) 
	.pipe(gulp.dest(devPath.src + devPath.js.dest));	
});
gulp.task('js-libs', ['js-libs-node-modules'], function() {
	return gulp.src([
		//devPath.src + devPath.jsLibs.src + '/jquery.min.js',
		//devPath.src + devPath.jsLibs.src + '/slick.min.js'
		])
	.pipe(rigger())
	.pipe(gulp.dest(devPath.src + devPath.js.dest)); 
});
gulp.task('js-libs-node-modules', function() {
	return gulp.src([
		//devPath.src + devPath.jsLibs.src + '/jquery.min.js',
		//devPath.src + devPath.jsLibs.src + '/slick.min.js',
		//devPath.src + devPath.jsLibs.src + '/custom-bootstrap.js'
		])
	.pipe(rigger())
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(devPath.src + devPath.js.dest));
});



//____________________build
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
	
	var buildHtml = gulp.src(devPath.src + devPath.html.src)
	.pipe(gulp.dest(prodPath.src));	

	var buildCss = gulp.src(devPath.src + devPath.css.dest + '/**/*.css')
	.pipe(gulp.dest(prodPath.src + prodPath.css));
	
	var buildJs = gulp.src(devPath.src + devPath.js.dest + '/**/*.js')
	.pipe(gulp.dest(prodPath.src + prodPath.js));

	var buildFonts = gulp.src(devPath.src + devPath.fonts)
	.pipe(gulp.dest(prodPath.src + prodPath.fonts));

});


gulp.task('clean', function() {
	return del(prodPath.src);
});


gulp.task('img', ['webp'], function() {
	return gulp.src(devPath.src + devPath.img.src) 
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest(prodPath.src + prodPath.img)); 		 
});
gulp.task('webp', function() {
	return gulp.src(devPath.src + '/img/**/*.{png,jpg}')
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest(devPath.src + devPath.img.dest));
});

//__________sprite.svg
gulp.task('post-html', ['sprite'], function() {
  return gulp.src(devPath.src + devPath.html.src)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(devPath.src + devPath.html.dest));
});
gulp.task('sprite', function() {
  return gulp.src(devPath.src + '/img/sprite-*.svg')
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(devPath.src + devPath.img.dest));
});
