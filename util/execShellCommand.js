const { exec } = require('child_process');

async function execShellCommand(command) {
    exec(command, (error, stdout, stderr) => {
    let errOutput = "";
    let stderrOutput = "";
    
    if (error) {
      errOutput = `exec error ${command}: ${error}`;
      console.error(errOutput);
    }
    if (stderr) {
      stderrOutput = ` stderr ${command}: ${stderr}`;
      console.error(stderrOutput);
    }
    let stdoutOutput = `Output ${command}: ${stdout}`;
    console.log(stdoutOutput);
    return `${errOutput}\\n${stderrOutput}\n${stdoutOutput}`
  });
}

exports.execShellCommand = execShellCommand;
