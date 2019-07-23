const {join} = require('path');
const fs = require('fs');
const simpleAst = require('ts-morph');
const dependencyTree = require('dependency-tree');
const {
  getApiTokenFromUser,
  Uploader,
  logSandboxUrl,
} = require('../../node-codesandbox');
const polarisPackage = require('../package.json');

const rootPath = join(__dirname, '..');
const playgroundPath = join(rootPath, 'playground');
const playgroundFilePath = join(playgroundPath, 'Playground.tsx');
const tsConfigPath = join(rootPath, 'tsconfig.json');
const srcPath = join(rootPath, 'src');

const playground = inspectPath(playgroundFilePath);
const playgroundSource = playground.getSourceFiles()[0];

const imports = getImports(playgroundSource);
const playgroundSrcImports = imports.find(({path}) => path === '../src');
const {
  nodeModules: nodeModuleDependencies,
  internalDependencies: srcDependencies,
} = getDependencyList(playgroundSrcImports.named);

const playgroundNodeModules = imports
  .filter(({isRelative}) => !isRelative)
  .map(({path}) => path);
const allNodeModules = [...nodeModuleDependencies, ...playgroundNodeModules];

const relativePlaygroundPath = 'playground/Playground.tsx';
const entryFilePath = 'index.tsx';
const componentsIndex = playgroundSrcImports.named
  .map(
    (componentName) =>
      `export {default as ${componentName}} from './${componentName}';`,
  )
  .join('\n');

const packageJSON = {
  name: 'polaris-playground',
  main: entryFilePath,
  dependencies: {
    ...constructPackageDependencies(allNodeModules),
    'react-dom': polarisPackage.devDependencies['react-dom'],
    'react-scripts': '^3.0.1',
  },
};

(async () => {
  const token = await getApiTokenFromUser();
  const uploader = new Uploader(token);
  const {sandboxUrl} = await uploader.upload(join(__dirname, '..'), {
    include: [
      ...srcDependencies,
      relativePlaygroundPath,
      'src/styles/polaris-tokens/*map.*',
      'src/styles/global.scss',
      'src/configure.ts',
      'src/index.ts',
    ],
    exclude: ['**/.DS_Store', '**/Polaris.*'],
    files: {
      'package.json': JSON.stringify(packageJSON, null, 2),
      'src/components/index.ts': componentsIndex,
      [entryFilePath]: `import React from "react";
import ReactDOM from "react-dom";
import AppProvider from './src/components/AppProvider';
import Playground from "./playground/Playground";

ReactDOM.render((
  <AppProvider>
    <Playground />
  </AppProvider>
), document.getElementById("root"));
`,
    },
  });
  logSandboxUrl(sandboxUrl);
})();

function getDependencyList(componentsToInclude) {
  let nodeModules = [];
  let internalDependencies = componentsToInclude
    .reduce((currentDeps, name) => {
      const {
        dependencies,
        nodeModules: componentNodeModules,
      } = getDependencyListForComponent(name);
      nodeModules = [...nodeModules, ...componentNodeModules];
      return [...currentDeps, ...dependencies];
    }, [])
    .map((path) => path.replace(`${rootPath}/`, ''));
  const appProviderDependencies = getDependencyListForComponent('AppProvider');
  internalDependencies = [
    ...appProviderDependencies.dependencies,
    ...internalDependencies,
  ];
  nodeModules = [...nodeModules, ...appProviderDependencies.nodeModules];
  return {
    nodeModules,
    internalDependencies,
  };
}

function getDependencyListForComponent(name) {
  const nodeModules = [];
  const dependencies = dependencyTree.toList({
    filename: join(srcPath, 'components', name, 'index.ts'),
    directory: join(srcPath, 'components', name),
    tsConfig: tsConfigPath,
    filter(path) {
      if (path.includes('node_modules')) {
        nodeModules.push(extractPackageNameFromPath(path));
        return false;
      }
      return true;
    },
  });
  return {dependencies, nodeModules};
}

function constructPackageDependencies(nodeModules) {
  return nodeModules
    .map((nodeModule) => ({
      [nodeModule]:
        polarisPackage.dependencies[nodeModule] ||
        polarisPackage.devDependencies[nodeModule] ||
        '*',
    }))
    .reduce((currentDeps, dep) => ({...currentDeps, ...dep}));
}

function extractPackageNameFromPath(path) {
  if (path.includes('@')) {
    return path.match(/@\w+\/[^/]+/)[0];
  }
  return path.match(/node_modules\/([^/]+)/)[1];
}

function getImports(file) {
  return file.getImportDeclarations().map((importDeclaration) => ({
    isRelative: importDeclaration.isModuleSpecifierRelative(),
    path: importDeclaration.getModuleSpecifierValue(),
    default: importDeclaration.getDefaultImport(),
    named: importDeclaration
      .getNamedImports()
      .map((specifier) => specifier.getName()),
    importDeclaration,
  }));
}

function getExports(file) {
  return file.getExportDeclarations().map((exportDeclaration) => ({
    isRelative: exportDeclaration.isModuleSpecifierRelative(),
    path: exportDeclaration.getModuleSpecifierValue(),
    named: exportDeclaration
      .getNamedExports()
      .map((specifier) => specifier.getName()),
    exportDeclaration,
  }));
}

function inspectPath(sourcePath) {
  const project = new simpleAst.Project();
  project.addExistingSourceFiles(sourcePath);
  return project;
}
