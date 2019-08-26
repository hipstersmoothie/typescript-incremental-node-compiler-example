const ts = require('typescript');

const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
const tsconfig = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: e => console.error(e)
  }
);
const { options, projectReferences, fileNames } = tsconfig;
const allOptions = {
  ...options,
  outDir: 'dist',
  incremental: true,
  emitDeclarationOnly: true
};

const host = ts.createIncrementalCompilerHost(allOptions, ts.sys);
const program = ts.createIncrementalProgram({
  host,
  options: allOptions,
  projectReferences,
  rootNames: fileNames
});

const { diagnostics } = program.emit();

const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(
  diagnostics,
  {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine,
    getCanonicalFileName: filename =>
      ts.sys.useCaseSensitiveFileNames ? filename : filename.toLowerCase()
  }
);

console.log(formattedDiagnostics);
