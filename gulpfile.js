const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const nunjucksRender = require("gulp-nunjucks-render");

const NUNJUCK_DIR = "./src/**/*.nunjucks";
const SASS_DIR = "./src/assets/scss/**/*.scss";
const SASS_DIST_DIR = "./dist/assets/css";
const IMG_DIR = "./src/assets/img/**/*";
const JS_DIR = "./src/assets/js/**/*";

const nunjuckBuild = cb => {
  return src("src/pages/**/*.+(html|nunjucks)")
    .pipe(
      nunjucksRender({
        path: "src/templates",
        data: {
          asset_path: "/assets"
        }
      })
    )
    .pipe(dest("dist"));
};

const sassBuild = cb => {
  return src(SASS_DIR)
    .pipe(sass().on("error", sass.logError))
    .pipe(dest(SASS_DIST_DIR));
};

const imgBuild = cb => {
  return src(IMG_DIR).pipe(dest("./dist/assets/img"));
};

const jsBuild = cb => {
  return src(JS_DIR).pipe(dest("./dist/assets/js"));
};

const sassWatch = () => watch(SASS_DIR, sassBuild);
const jsWatch = () => watch(JS_DIR, jsBuild);
const imgWatch = () => watch(IMG_DIR, imgBuild);
const nunjuckWatch = () =>
  watch(NUNJUCK_DIR, { ignoreInitial: false }, nunjuckBuild);

exports.build = series(sassBuild, imgBuild, jsBuild, nunjuckBuild);
exports.default = parallel(sassWatch, imgWatch, jsWatch, nunjuckWatch);
