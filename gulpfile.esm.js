import { src, dest, watch, series, parallel, lastRun } from 'gulp';
import { env, noop } from 'gulp-util';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import sassCompiler from 'node-sass';
import del from 'del';
import fileInclude from 'gulp-file-include';
import beautify from 'gulp-beautify';
import sourceMaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import sortMediaQueries from 'postcss-sort-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import cssImport from 'gulp-cssimport';
import stripCssComments from 'gulp-strip-css-comments';
import minifyCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import svgSprite from 'gulp-svg-sprite';

const isProd = env.production;

const bs = browserSync.create();
const sass = gulpSass(sassCompiler);

const srcPath = './src';
const distPath = `./dist/${isProd ? 'production' : 'development'}`;

const paths = {
    html: {
        src: `${srcPath}/html/*.html`,
        watch: `${srcPath}/html/**/*.html`,
        dest: distPath,
    },
    scss: {
        src: `${srcPath}/css/style.scss`,
        watch: `${srcPath}/css/**/*.scss`,
        dest: `${distPath}/css`,
    },
    cssLibs: {
        src: `${srcPath}/css/libs.css`,
        watch: [`${srcPath}/css/libs.css`, `${srcPath}/libs/**/*.css`],
        dest: `${distPath}/css`,
    },
    fonts: {
        src: `${srcPath}/fonts/**/*`,
        dest: `${distPath}/fonts`,
    },
    images: {
        src: `${srcPath}/images/**/*.{jpg,png,gif,ico}`,
        dest: `${distPath}/images`,
    },
    svgSprite: {
        src: `${srcPath}/images/svg-sprite/**/*.svg`,
        dest: `${distPath}/images`,
    },
};

export const clean = () => {
    return del(distPath);
};

export const html = () => {
    return src(paths.html.src)
        .pipe(fileInclude({ prefix: '@' }))
        .pipe(isProd ? beautify.html({}) : noop())
        .pipe(dest(paths.html.dest))
        .pipe(bs.stream());
};

export const scss = () => {
    const sassConfig = {
        outputStyle: 'expanded',
        indentWidth: 4,
    };

    return src(paths.scss.src)
        .pipe(isProd ? noop() : sourceMaps.init())
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(postcss([sortMediaQueries]))
        .pipe(isProd ? autoprefixer(['last 15 versions', '>1%']) : noop())
        .pipe(isProd ? beautify.css({}) : sourceMaps.write())
        .pipe(dest(paths.scss.dest))
        .pipe(bs.stream());
};

export const cssLibs = () => {
    return src(paths.cssLibs.src)
        .pipe(isProd ? noop() : sourceMaps.init())
        .pipe(cssImport())
        .pipe(isProd ? stripCssComments({ preserve: false }) : noop())
        .pipe(isProd ? minifyCss({ level: 2 }) : noop())
        .pipe(rename({ suffix: '.min' }))
        .pipe(isProd ? noop() : sourceMaps.write())
        .pipe(dest(paths.cssLibs.dest))
        .pipe(bs.stream());
};

export const fonts = () => {
    return src(paths.fonts.src, { since: lastRun(fonts) })
        .pipe(dest(paths.fonts.dest))
        .pipe(bs.stream());
};

export const images = () => {
    return src(paths.images.src, { since: lastRun(images) })
        .pipe(dest(paths.images.dest))
        .pipe(bs.stream());
};

export const sprite = () => {
    const fileName = 'sprite';

    return src(paths.svgSprite.src)
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        dest: '.',
                        sprite: fileName,
                    },
                },
            })
        )
        .pipe(dest(paths.svgSprite.dest))
        .pipe(bs.stream());
};

export const watcher = () => {
    bs.init({
        server: distPath,
        open: false,
        notify: false,
    });

    watch(paths.html.watch, html);
    watch(paths.scss.watch, scss);
    watch(paths.cssLibs.watch, cssLibs);
    watch(paths.fonts.src, fonts);
    watch(paths.images.src, images);
    watch(paths.svgSprite.src, sprite);
};

export const build = parallel(html, scss, cssLibs, fonts, images, sprite);

export default series(clean, build, watcher);
