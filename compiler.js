const ts = require('typescript');
const path = require('path');

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
  incremental: true,
  tsBuildInfoFile: path.join(__dirname, 'tsconfig.tsbuildinfo')
};

const host = ts.createIncrementalCompilerHost(allOptions, ts.sys);
const program = ts.createIncrementalProgram({
  host,
  options: allOptions,
  projectReferences,
  rootNames: fileNames
});

const result = program.emit();
const allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(result.diagnostics);

if (allDiagnostics.length) {
  const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(
    allDiagnostics,
    {
      getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
      getNewLine: () => ts.sys.newLine,
      getCanonicalFileName: filename =>
        ts.sys.useCaseSensitiveFileNames ? filename : filename.toLowerCase()
    }
  );

  console.log(formattedDiagnostics);
}
