# @fang/core

Task runner for Node.JS

[![npm](https://img.shields.io/npm/v/@fang/core)](https://www.npmjs.com/package/@fang/core) [![NPM](https://img.shields.io/npm/l/@fang/core)](https://github.com/khalyomede/fang-core/blob/master/LICENSE) [![Build Status](https://travis-ci.com/khalyomede/fang-core.svg?branch=master)](https://travis-ci.com/khalyomede/fang-core) [![codecov](https://codecov.io/gh/khalyomede/fang-core/branch/master/graph/badge.svg)](https://codecov.io/gh/khalyomede/fang-core) [![Maintainability](https://api.codeclimate.com/v1/badges/0bf7e947b52754320e4d/maintainability)](https://codeclimate.com/github/khalyomede/fang-core/maintainability) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@fang/core) [![Known Vulnerabilities](https://snyk.io/test/github/khalyomede/fang-core/badge.svg?targetFile=package.json)](https://snyk.io/test/github/khalyomede/fang-core?targetFile=package.json)

## Summary

- [About](#about)
- [Features](#features)
- [Examples](#examples)
- [Create your Fang plugin](#create-your-fang-plugin)
- [API](#api)
- [Plugins list](#plugins-list)
- [Changelog](CHANGELOG.md)
- [Credits](#credits)

## About

I created this library to help me run faster builds using all my available CPUs. I am a long time Gulp user, and when I saw the `gulp.parallel` utility, I expected it would allow parallelizing tasks, but it was just using a single CPU to run tasks asynchronously.

This library is not meant for "small" bundles as the cost of creating forks can be actually worse for build that last less than a few hundreds of milliseconds. For the rest of the developers that have relatively medium to big bundles, Fang might be able to reduce the time spent bundling your project.

With Fang, each "tasks" is meant to be run in a CPU core. Which means you can leverage building servers with an high amount of CPU cores (like AWS instances for example). Whenever you have more tasks than available CPU cores, the tasks are put in queues until a CPU core frees itself. All methods in a task are run sequentially, so you might want to think differently than you would in Gulp, but this library is quite inspired by this package.

## Features

Runs tasks in parallel using all the available cores.

## Examples

- [1. Run Fang using Node via a script.js](#1-run-fang-using-node-via-a-script-js)

### 1. Run Fang using Node via a script.js

Create a script wherever you want. For example, at the root of your folder, create a `script.js`, and add this basic task.

```javascript
const { run } = require("@fang/core");
const save = require("@fang/save");

const robots = {
  name: "robots.txt",
  input: "src/robots.txt",
  tasks: [
    save({
      folder: "dist",
    }),
  ],
};

const main = async () => {
  await run([robots]);
};

main();
```

Then, install the required dependencies using your favorite package manager. For example, using NPM.

```bash
npm install --save-dev @fang/core @fang/save
```

Finally, run your task using `node` in the command line.

```bash
node script.js
```

You should see something like this in your console.

```
$ node script.js
fang: start
8 CPUs core(s)
1 tasks to run
robots.txt: start
robots.txt: 10.228ms
fang: 1.223s
```

## Create your Fang plugin

_**This tutorial uses Typescript**. If you do not feel comfortable with it setting up the required tool for building Typescript files, jump to the end of this section where you can grab a starter project._

Creating a plugin is very straight forward. There is only a couple of things to know, and you are ready to go!

- You should export a function
- It should take in parameter a list of files (more on what is a file below)
- It should return a function that returns a list of files, or a promise that resolves with a list of files

And that's it! Now that you have this in mind, let's get started from scratch. If you are lazy, you can jump to the end of this section, where a fang-plugin-starter is ready to be cloned and tweaked.

- [1. Install the required dependencies](#1-install-the-required-dependencies)
- [2. Add fang as a peer dependency in your package.json](#2-add-fang-as-a-peer-dependency-in-your-package-json)

1. Install the required dependencies

```bash
yarn add --dev @fang/core
```

2. Add fang as a peer dependency in your package.json

```json
// package.json
{
  "peerDependencies": {
    "@fang/core": "0.*"
  }
}
```

Use the available version of your choice.

3. Create your source file with this example

```typescript
import { IFile } from "@fang/core";

interface IOptions {
  // to be completed as you need
}

// src/index.ts
export default (options: IOptions) => (files: Array<IFile>): Array<IFile> => {
  for (const [index, file] of files.entries()) {
    // do something with file...
    files[index] = file;
  }

  return files;
};
```

See [IFile](#ifile) for a detail of what you can do with this variable.

4. Build your project

I will not cover this section, as you can use whatever you need: Rollup, Gulp, ...

5. Add your library to the main file in package.json

```json
{
  "main": "lib/index.js"
}
```

6. Add a "fang-plugin" keyword to your package.json

This is for the future, where this doc will be hosted in his own website, and I will be able to automatically pull new published packages with this keyword on the plugin section of the documentation.

```json
{
  "keywords": ["fang-plugin", "..."]
}
```

7. Profit

That's it! Now others folks can use your package, your task, your plugin, ... whatever :)

If you need some inspirations, you can browse the source codes of some of these simple plugins to start.

- [@fang/save](https://github.com/khalyomede/fang-save)
- [@fang/terser](https://npmjs.com/package/@fang/terser)
- [@fang/typescript](https://github.com/khalyomede/fang-typescript)

If you want to get started fast, or you don't want to mess around with installing the required package to transpile, build, test, ... you can clone the fang starter plugin to get started! All the doc is available at [https://github.com/khalyomede/fang-starter-plugin](https://github.com/khalyomede/fang-starter-plugin).

Happy coding!

## API

- [fang.run](#fang-run)
- [IFile](#ifile)

### fang.run

Runs the tasks in paralell using all the available CPUs.

```typescript
const run = async (tasks: Array<ITask>): Promise<void>;
```

### IFile

Represents a file.

```typescript
interface IFile {
	path: string;
	content: Buffer:
}
```

## Plugins list

- [@fang/save](https://npmjs.com/package/@fang/save): Save your files into the desired folder.
- [@fang/terser](https://npmjs.com/package/@fang/terser): Compress Javascript files using Terser.
- [@fang/typescript](https://npmjs.com/package/@fang/typescript): Transpiles your Typescript files and generates declaration files.

## Credits

Logo from an original icon by tulpahn from the Noun Project.
