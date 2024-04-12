const gulp = require('gulp');
const pug = require('gulp-pug');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync').create();

// Pug のコンパイルタスク
gulp.task('pug', function () {
  return gulp.src('src/*.pug') // Pug ファイルの場所
    .pipe(data(function (file) {
      // 同じ名前の JSON ファイルからデータを読み込む
      return JSON.parse(fs.readFileSync(path.join('src/data', path.basename(file.path, '.pug') + '.json'), 'utf8'));
    }))
    .pipe(pug()) // Pug をコンパイル
    .pipe(gulp.dest('dist')) // 出力先
    .pipe(browserSync.stream()); // ブラウザリロード
});

// ブラウザの同期とウォッチタスク
gulp.task('serve', function () {
  browserSync.init({
    server: "./dist" // サーバのルートとなるディレクトリ
  });

  gulp.watch('src/*.pug', gulp.series('pug')); // Pug ファイルに変更があったら pug タスクを実行
  gulp.watch('src/data/*.json', gulp.series('pug')); // JSON ファイルの変更を監視
  gulp.watch('dist/*.html').on('change', browserSync.reload); // HTML が変更されたらリロード

});

// デフォルトタスク
gulp.task('default', gulp.series('pug', 'serve'));
