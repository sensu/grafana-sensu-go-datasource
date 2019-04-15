# Sensu Go Data Source

## Developing

    npm install     # installs all required dependencies
    npm run watch   # starts watch server (builds the project as soon as it detects file changes)

    npm run build   # builds the package

## Releasing and Bundling

Use [release-it](https://www.npmjs.com/package/release-it) plugin for creating a release bundle.

    release-it [--no-git.requireCleanWorkingDir]
