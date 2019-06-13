/* eslint-disable no-console */

const {execSync} = require('child_process');
const {join, resolve: resolvePath} = require('path');
const {
  ensureDirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
} = require('fs-extra');
const {rollup} = require('rollup');
const {cp, mv, rm} = require('shelljs');
const copyfiles = require('copyfiles');

const createRollupConfig = require('../config/rollup');
const packageJSON = require('../package.json');
const generateSassBuild = require('./sass-build');

const root = resolvePath(__dirname, '..');
const build = resolvePath(root, 'build');
const finalEsnext = resolvePath(root, 'esnext');

const docs = resolvePath(root, './docs');
const intermediateBuild = resolvePath(root, './build-intermediate');
const mainEntry = resolvePath(intermediateBuild, './index.js');

const scripts = resolvePath(root, 'scripts');
const types = resolvePath(root, 'types');
const tsBuild = resolvePath(scripts, 'tsconfig.json');

execSync(
  `${resolvePath(
    root,
    './node_modules/.bin/tsc',
  )} --outDir ${intermediateBuild} --project ${tsBuild}`,
  {
    stdio: 'inherit',
  },
);

mv(resolvePath(root, 'types/src/*'), types);
rm('-rf', resolvePath(root, 'types/src'));

mv(resolvePath(intermediateBuild, 'src/*'), intermediateBuild);

copy(['./src/**/*.md', docs], {up: 1}).catch((error) => {
  console.error(error);
  process.exit(1);
});

copy(['./src/**/*.{scss,svg,png,jpg,jpeg,json}', intermediateBuild], {up: 1})
  .then(() => {
    [
      resolvePath(intermediateBuild, './styles/global/elements.scss'),
      resolvePath(intermediateBuild, './configure.js'),
    ].forEach((file) => {
      writeFileSync(
        file,
        readFileSync(file, 'utf8')
          .replace(/\{\{POLARIS_VERSION\}\}/g, packageJSON.version)
          .replace(/<%= POLARIS_VERSION %>/g, packageJSON.version),
      );
    });
  })
  .then(() => {
    getAllSassFilesFromDirectory(
      resolvePath(intermediateBuild, './components'),
    ).forEach(rewriteSassImport);
  })
  // Custom build consumed by Sewing Kit: it preserves all ESNext features
  // including imports/ exports for better tree shaking.
  .then(() => ensureDirSync(finalEsnext))
  .then(() => cp('-R', `${intermediateBuild}/*`, finalEsnext))
  .then(() => {
    const indexPath = join(finalEsnext, 'index.js');
    const esnextIndex = readFileSync(indexPath, 'utf8');
    writeFileSync(
      indexPath,
      esnextIndex.replace(/import '.\/styles\/global\.scss';/g, ''),
    );
  })
  // Main CJS and ES modules bundles: supports all our supported browsers and
  // uses the full class names for any Sass imports
  .then(() => runRollup())
  .then(() =>
    Promise.all([
      cp('build/polaris.js', './index.js'),
      cp('build/polaris.es.js', './index.es.js'),
      cp('build/polaris.css', './styles.css'),
    ]),
  )
  // Main Sass build that includes the full CSS class names
  .then(() => generateSassBuild(build))
  .then(() => {
    cp('-r', resolvePath(build, 'sass', '*'), root);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function runRollup() {
  const config = createRollupConfig({
    entry: mainEntry,
    cssPath: resolvePath(build, 'polaris.css'),
  });

  return rollup(config).then((bundle) =>
    Promise.all([
      bundle.write({
        format: 'cjs',
        file: resolvePath(build, 'polaris.js'),
      }),
      bundle.write({
        format: 'esm',
        file: resolvePath(build, 'polaris.es.js'),
      }),
    ]),
  );
}

function copy(paths, config) {
  return new Promise((resolve, reject) => {
    copyfiles(paths, config, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function getAllSassFilesFromDirectory(dir, filelist = []) {
  let result = filelist;
  const files = readdirSync(dir);
  files.forEach((file) => {
    if (statSync(`${dir}/${file}`).isDirectory()) {
      result = getAllSassFilesFromDirectory(`${dir}/${file}`, result);
    } else if (/\.scss$/.test(file)) {
      result.push(`${dir}/${file}`);
    }
  });
  return result;
}

function rewriteSassImport(filePath) {
  const regex = /@import ['"](foundation|shared)(.*?)['"];/gim;
  const fileContent = readFileSync(filePath, 'utf8');

  const newFileContent = fileContent.replace(
    regex,
    (match, namespace, path) =>
      `@import '${getRelativePath(filePath)}${namespace}${path}';`,
  );

  if (newFileContent !== fileContent) {
    writeFileSync(filePath, newFileContent);
  }
}

function getRelativePath(filePath) {
  const pathFragments = filePath.split('/');

  let pathFragment = pathFragments.pop();
  let levels = 0;

  while (pathFragment !== 'build-intermediate' && pathFragments.length !== 0) {
    levels++;
    pathFragment = pathFragments.pop();
  }

  const backLevels = new Array(levels - 1)
    .fill(0)
    .map(() => '../')
    .join('');

  return `${backLevels}styles/`;
}
