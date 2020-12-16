# 1C enterprise repository tools

[Русская версия](https://github.com/cinex-ru/e1c-repo-tools/blob/master/README.md)

## Installation

``` bash
npm install -D e1c-repo-tools
```

or

``` bash
yarn add -D e1c-repo-tools
```

## Config

In the `package.json` file, add the `e1cRepoConfig` field, which contains the following settings:

- `pathToExecutable` - (string, required) full path to the executable of 1C enterprise
- `pathToSrcDir` - (string, default: `./src`) path to the directory that contains source files of external data processors/reports
- `pathToDistDir` - (string, default: `./dist`) path to the directory that contains built external data processors/reports
- `pathToLogsDir` - (string, default: `./logs`) path to the directory that contains logs
- `filesExtensions` - (array of strings, default: `["erf", "epf"]`) extensions that used to search for files when they dump into source files

## Usage

There are currently three cli utils:

- `e1c-dump` - dump external reports/processors into the source files based on the settings in `package.json`. If the directory, where the unloading is performed, contains changes, then before deleting a backup copy of it is created
- `e1c-build` - build source files into external reports/processors based on the settings in `package.json`. If a file with the corresponding name exists and contains changes, it is backed up
- `e1c-precommit-hook` - script, to be used as a git-hook. It works similarly to `e1c-dump`, but only staged files are used to dump them. It also adds the source files to the current commit after they have been staged
