# @fang/core

Task runner for Node.JS

## Summary

- [About](#about)
- [Features](#features)
- [Examples](#examples)

## About

I created this library to help me run faster builds using all my available CPUs. I am a long time Gulp user, and when I saw the `gulp.parallel` utility, I expected it would allow parallelizing tasks, but it was just using a single CPU to run tasks asynchronously.

This library is not meant for "small" bundles as the cost of creating forks can be actually worse for build that last less than a few hundreds of milliseconds. For the rest of the developers that have relatively medium to big bundles, Fang might be able to reduce the time spent bundling your project.

With Fang, each "tasks" is meant to be run in a CPU core. Which means you can leverage building servers with an high amount of CPU cores (like AWS instances for example). Whenever you have more tasks than available CPU cores, the tasks are put in queues until a CPU core frees itself. All methods in a task are run sequentially, so you might want to think differently than you would in Gulp, but this library is quite inspired by this package.

## Features

- Is the required package to run and create tasks
- Taske an entry point (for the moment, a single file, in the future, a glob of files will be accepted), and runs the functions sequentially
- You need a plugin to do everything, from transpiling to saving files, even for renaming output files, so this core library is the smallest and unopiniated possible

## Examples

- [1. Transpile PUG files](#transpile-pug-files)

### 1. Transpile PUG files

In a file `fang.config.js`, add the following content.

```javascript
// fang.config.js

import { task } from "@fang/core";
import pug from "@fang/plugin-pug";
import save from "@fang/plugin-save";

const html = {
  name: "html",
  inputFilePath: "src/pug/index.pug",
  plugins: [
    pug(),
    save({
      path: "dist/index.html",
    }),
  ],
};

const build = [html];

export { build };
```

After having installed `@fang/cli`, add this script to your `package.json`.

```javascript
{
	"scripts": {
		"build": "fang build"
	}
}
```

In your console, run the following command.

```bash
$ fang build
Using a maximum of 8 CPU(s) core(s).
1 task to run.
fang: start
html: start
html: 46.986ms
fang: 109.07ms
```
