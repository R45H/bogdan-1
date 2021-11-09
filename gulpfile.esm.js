import { src, dest, watch, series, parallel, lastRun } from 'gulp';
import del from 'del';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import sassCompiler from 'node-sass';
import sourceMaps from 'gulp-sourcemaps';
import cssImport from 'gulp-cssimport';
import svgSprite from 'gulp-svg-sprite';

const bs = browserSync.create();
const sass = gulpSass(sassCompiler);

const srcPath = './src';
const distPath = './dist';

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
    javaScript: {
        src: `${srcPath}/js/*.js`,
        dest: `${distPath}/js`,
    },
    slick: {
        src: `${srcPath}/slick/*`,
        dest: `${distPath}/slick`,
    },
};

export const clean = () => {
    return del('./dist');
};

export const html = () => {
    return src(paths.html.src)
        .pipe(fileInclude({ prefix: '@' }))
        .pipe(dest(paths.html.dest))
        .pipe(bs.stream());
};

export const scss = () => {
    const sassConfig = {
        outputStyle: 'expanded',
        indentWidth: 4,
    };

    return src(paths.scss.src)
        .pipe(sourceMaps.init())
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(sourceMaps.write())
        .pipe(dest(paths.scss.dest))
        .pipe(bs.stream());
};

export const cssLibs = () => {
    return src(paths.cssLibs.src)
        .pipe(sourceMaps.init())
        .pipe(cssImport())
        .pipe(sourceMaps.write())
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

export const javaScript = () => {
    return src(paths.javaScript.src, { since: lastRun(javaScript) })
        .pipe(dest(paths.javaScript.dest))
        .pipe(bs.stream());
};

export const slick = () => {
    return src(paths.slick.src, { since: lastRun(javaScript) })
        .pipe(dest(paths.slick.dest))
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

export default series(clean, parallel(html, scss, cssLibs, fonts, images, sprite, javaScript, slick), watcher);
