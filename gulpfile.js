var gulp = require ('gulp');
var uglify = require ('gulp-uglify');
var clean = require ('gulp-clean');
var copy = require('gulp-copy');
var imagemin =require ('gulp-imagemin');
var sass2css = require ('gulp-sass');
var browserSync = require ('browser-sync').create();
var typescript = require ('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json');
var sourcemaps = require ('gulp-sourcemaps');
var concat = require ('gulp-concat');
var jshint = require ('gulp-jshint');


// Definición de directorios origen
var srcPaths = {
    images:   'src/img/',
    scripts:  'src/ts/',
    styles:   'src/sass/',
    files:    'src/',
    data:     'data/',
    vendor:   'vendor'
};

// Definición de directorios destino
var distPaths = {
    images:   'dist/data/img/',
    scripts:  'dist/data/js/',
    styles:   'dist/data/css/',
    files:    'dist/data/',
    data:     'dist/data/',
    vendor:   'dist/data/vendor/'
};

// Limpieza de la carpeta dist
gulp.task('clean', function(cb) {
    clean([ distPaths.files+'*.html', distPaths.images+'**/*', distPaths.scripts+'*.js', distPaths.styles+'*.css'], cb);
});


//Procesamiento de imágenes para comprimir / optimizar.
gulp.task('imagemin', function() {
    return gulp.src([srcPaths.images+'**/*'])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(distPaths.images))
    /*.pipe(browserSync.stream());*/
});

//transpilación de sass
gulp.task('sass2css', function() {
    return gulp.src([srcPaths.styles+'**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass2css())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.styles))
    /*.pipe(browserSync.stream());*/
});

//nuevo plugin de copy, quité las demás quité , srcPaths.scripts+'*.js', srcPaths.vendor+'**/*' - no funciona
gulp.task('copy', function () {
    return gulp.src(['*.html', srcPaths.scripts+'*.js', srcPaths.vendor+'**/*'], {
        base: srcPaths.files
    }).pipe(gulp.dest(distPaths.data));
});

//a ver este typescript si elimina los errores ts288 y ts6082
gulp.task('typescript', function () {
    var tsResult = gulp.src(srcPaths.scripts+'**/*.ts');
    return tsProject.src()
        .pipe(tsProject({
            noImplicitAny: true,
            outFile: 'false'
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('.app.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.scripts))
        .pipe(browserSync.reload({stream: true}));
});



//default le quité la tarea "server"
gulp.task('default', ['clean', 'copy', 'imagemin', 'sass2css', 'typescript'], function() {
});