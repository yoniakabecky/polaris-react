const {
  join
} = require('path');
const simpleAst = require('ts-morph');
const dependencyTree = require('dependency-tree');

const playgroundPath = join(__dirname, '..', 'playground');
const playgroundFilePath = join(playgroundPath, 'Playground.tsx');
const tsConfigPath = join(__dirname, '..', 'tsconfig.json');
const srcPath = join(__dirname, '..', 'src');

const playground = inspectPath(playgroundFilePath);
const playgroundSource = playground.getSourceFiles()[0];

const imports = getImports(playgroundSource);
const polarisImport = imports.find(({
  path
}) => path === '../src');

const dependencyPaths = getDependencyList(polarisImport.named);
const relativePaths = dependencyPaths.map((path) =>
  path.replace(`${srcPath}/`, ''),
);

// remove Playground.tsx path
relativePaths.pop();

console.log(srcPath, relativePaths);

function getDependencyList(componentsToInclude) {
  return dependencyTree.toList({
    filename: playgroundFilePath,
    directory: playgroundPath,
    tsConfig: tsConfigPath,
    filter(path) {
      if (path.includes('node_modules')) {
        return false;
      }
      if (!/\/components\/[^/]+\//.test(path)) {
        return true;
      }
      return componentsToInclude.some((componentName) =>
        path.includes(componentName),
      );
    },
  });
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

function inspectPath(sourcePath) {
  const project = new simpleAst.Project();
  project.addExistingSourceFiles(sourcePath);
  return project;
}
