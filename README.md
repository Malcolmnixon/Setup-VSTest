[![Actions Status](https://github.com/Malcolmnixon/Setup-VSTest-Test/workflows/framework-windows/badge.svg)](https://github.com/Malcolmnixon/Setup-VSTest-Test/actions)

# Setup-VSTest

NOTE: This is a clone of Setup-MSBuild by Warren Buckley modified to find VSTest.Console.exe rather than MSBuild.exe.

This action sets up VSTest.Console.exe as a CLI tool for use in actions by:
- optionally downloading and caching a version of VSWhere.exe to help find the latest VSTest.Console on the machine
- Adds the location of the VSTest.Console to the PATH


# Example Project
The [Setup-VSTest-Test](https://github.com/Malcolmnixon/Setup-VSTest-Test) project is a simple demo showing:
 - Restoring a project using Nuget
 - Building a project using MSBuild
 - Testing a project using VSTest
 
# Usage

Basic:
```yaml
name: example-net-framework-build

on: [push]

jobs:
  build:

    runs-on: windows-latest

    steps:
    - uses: actions/checkout@v1
      
    - name: Setup Nuget.exe
      uses: warrenbuckley/Setup-Nuget@v1

    - name: Nuget restore
      run: nuget restore TestProject.sln
      
    - name: Setup MSBuild.exe
      uses: warrenbuckley/Setup-MSBuild@v1

    - name: MSBuild
      run: msbuild TestProject.sln
      
    - name: Setup VSTest.exe
      uses: Malcolmnixon/Setup-VSTest@v2

    - name: VSTest
      run: vstest.console ClassLibrary.Test\bin\Debug\ClassLibrary.Test.dll
```


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
