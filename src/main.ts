import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as fs from 'fs';
import { ExecOptions } from '@actions/exec/lib/interfaces';

async function run() {
  try {

    // VSTest.Console is not a tool we download
    // as Visual Studio is installed on Windows machines
    // However we need to download & use VSWhere to tell us
    // where VSTest.Console is so we can add it that dir to the PATH

    // Tripple check it's Windows process
    // Can't install VSWhere.exe for Ubuntu image etc..
    const IS_WINDOWS = process.platform === 'win32';
    if(IS_WINDOWS === false){
      core.setFailed("VSTest.Console.exe only works for Windows.");
      return;
    }

    // Try & find tool in cache
    let directoryToAddToPath:string;
    directoryToAddToPath = await tc.find("vswhere", "2.7.1");

    if(directoryToAddToPath){
      core.debug(`Found local cached tool at ${directoryToAddToPath} adding that to path`);

      var vsTestPath = await FindVSTest(directoryToAddToPath);
      core.debug(`VSTestPath == ${vsTestPath}`);

      // Add folder where VSTest lives to the PATH
      await core.addPath(vsTestPath);
      return;
    }

    // Download VSWhere 2.7.1 release
    core.debug("Downloading VSWhere v2.7.1 tool");
    const vsWherePath = await tc.downloadTool("https://github.com/microsoft/vswhere/releases/download/2.7.1/vswhere.exe");

    // Rename the file which is a GUID without extension
    var folder = path.dirname(vsWherePath);
    var fullPath = path.join(folder, "vswhere.exe");
    fs.renameSync(vsWherePath, fullPath);

    //Cache the directory with VSWhere in it - which returns a NEW cached location
    var cachedToolDir = await tc.cacheDir(folder, "vswhere", "2.7.1");
    core.debug(`Cached Tool Dir ${cachedToolDir}`);

    var vsTestPath = await FindVSTest(cachedToolDir);
    core.debug(`VSTestPath == ${vsTestPath}`);

    // Add folder where VSTest.Console lives to the PATH
    await core.addPath(vsTestPath);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();


async function FindVSTest(pathToVSWhere:string):Promise<string>{

  let vsTestPath = "";

  const options:ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      var output = data.toString();
      vsTestPath += output;
    }
  };

  // Run VSWhere to tell us where VSTest.Console is
  var vsWhereExe = path.join(pathToVSWhere, "vswhere.exe");
  await exec.exec(vsWhereExe, ['-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Workload.ManagedDesktop', 'Microsoft.VisualStudio.Workload.Web', '-requiresAny', '-property', 'installationPath'], options);

  if(vsTestPath === ""){
    core.setFailed("Unable to find VSTest.Console.exe");
  }

  vsTestPath = path.join(vsTestPath.trimRight(), '\\Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\vstest.console.exe')

  var folderForVSTest = path.dirname(vsTestPath)
  core.debug(`VSTest = ${vsTestPath}`);
  core.debug(`Folder for VSTest ${folderForVSTest}`);

  return folderForVSTest;
}