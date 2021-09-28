const bs = require('browser-sync').create();

bs.init({
    server: {
        baseDir: './src',
        routes: {
            '/dist': './dist',
        },
    },
    files: ['dist/css/style.css'],
    open: false,
    notify: false,
    plugins: [
        {
            module: 'bs-html-injector',
            options: {
                files: ['src/*.html'],
            },
        },
    ],
});
