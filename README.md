
# setup-VSTest

This action sets up VSTest.Console.exe as a CLI tool for use in actions by:
- optionally downloading and caching a version of VSWhere.exe to help find the latest VSTest.Console on the machine
- Adds the location of the VSTest.Console to the PATH


# Usage

Basic:
```yaml
steps:
name: ASP.NET CI
on: [push]
jobs:
  build:
    runs-on: windows-latest

    steps:
    - uses: actions/checkout@master

    - name: Setup VSTest.Console.exe
      uses: malcolmnixon/Setup-VSTest@master

    - name: VSTest.Console
      working-directory: src
      run: vstest.console MyProject.dll
```


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)