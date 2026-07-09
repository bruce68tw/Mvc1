const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const fs = require('fs');

// 讀取 bundleconfig.json
const bundleConfig = JSON.parse(fs.readFileSync('./bundleconfig.json', 'utf8'));

/**
 * 處理打包與壓縮的通用函數
 */
function processBundle(bundle) {
    const isJs = bundle.outputFileName.endsWith('.js');
    const isCss = bundle.outputFileName.endsWith('.css');
    const fileName = bundle.outputFileName.split('/').pop();
    const destDir = bundle.outputFileName.substring(0, bundle.outputFileName.lastIndexOf('/'));

    return gulp.src(bundle.inputFiles)
        .pipe(concat(fileName))
        .pipe(gulp.dest(destDir)) // 輸出原始版 (例如: lib.js)
        .pipe(isJs ? uglify() : cleanCSS()) // 根據類型壓縮
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(destDir)); // 輸出壓縮版 (例如: lib.min.js)
}

// 動態產生任務
const bundleTasks = bundleConfig.map(bundle => {
    const taskName = `bundle:${bundle.outputFileName}`;
    gulp.task(taskName, () => processBundle(bundle));
    return taskName;
});

// copy css base
gulp.task('copy-css', () => {
    return gulp.src('../Base/BaseTs/_dist/cssBase/*')
        .pipe(gulp.dest('wwwroot/_src/cssBase'));
});

// copy css base
gulp.task('copy-js', () => {
    return gulp.src('../Base/BaseTs/_dist/jsBase/**/*')
        .pipe(gulp.dest('wwwroot/_src/jsBase'));
});

// Locale 目錄直接複製任務
gulp.task('copy-locale', () => {
    return gulp.src('../Base/BaseTs/_dist/jsBase/Locale/**/*')
        .pipe(gulp.dest('wwwroot/locale'));
});

// copy-font 任務
gulp.task('copy-font', () => {
    // 將來源路徑調整為您實際存放字型的資料夾
    return gulp.src('../Base/BaseTs/_dist/font/*')
        .pipe(gulp.dest('wwwroot/font'));
});

// 組合所有任務
gulp.task('default', gulp.series(
    // 將多個複製任務設為並行，提升執行效率
    gulp.parallel('copy-css', 'copy-js', 'copy-locale', 'copy-font'),
    gulp.parallel(...bundleTasks)
));