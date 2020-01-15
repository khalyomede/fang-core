import { ITask, IWorkerTask, IFile } from "./interface";
import { cpus } from "os";
import { fork, isMaster, isWorker, on } from "cluster";
import { promisify } from "util";
import { readFile, exists } from "fs";
import { dirname } from "path";
import glob from "glob";

const asyncReadFile = promisify(readFile);
const asyncGlob = promisify(glob);
const asyncExists = promisify(exists);

const getBaseDirectory = async (filePath: string) => {
	const subDirectoryLookup = /(.*)\*\*\//;

	if (subDirectoryLookup.test(filePath)) {
		const matches = filePath.match(subDirectoryLookup);

		if (matches === null) {
			throw new Error(
				`unable to get the directory before your subdirectory lookup (**/), if you are using **/, you should add a directory before`
			);
		}

		if (matches.length < 2) {
			throw new Error(
				`unable to catch the directory before your sub directory lookup (**/)`
			);
		}

		return matches[1];
	} else {
		const exists = await asyncExists(filePath);

		if (!exists) {
			throw new Error("the file does not exists");
		}

		return dirname(filePath);
	}
};

const run = async (tasks: Array<ITask>) => {
	if (isMaster) {
		console.time("fang");
		console.log("fang: start");

		const numberOfCpus = cpus().length;
		const numberOfTasks = tasks.length;
		const numberOfUsedCpus = numberOfCpus;
		const numberOfTasksToRunOnTheFirstRun =
			numberOfTasks > numberOfUsedCpus ? numberOfUsedCpus : numberOfTasks;
		let numberOfRemainingTasks = tasks.length;
		let taskIndex = 0;

		console.log(`${numberOfCpus} CPUs core(s)`);
		console.log(`${numberOfTasks} tasks to run`);

		for (let index = 0; index < numberOfTasksToRunOnTheFirstRun; index++) {
			const task = tasks[taskIndex];
			const worker = fork();

			worker.send({
				...task,
				taskIndex,
			});

			taskIndex++;
		}

		on("message", worker => {
			numberOfRemainingTasks--;

			if (numberOfRemainingTasks < 1) {
				console.timeEnd("fang");

				process.exit(0);
			} else {
				const task = tasks[taskIndex];

				if (typeof task !== "undefined") {
					worker.send({
						...task,
						taskIndex,
					});

					taskIndex++;
				}
			}
		});
	} else if (isWorker) {
		process.on("message", async (workerTask: IWorkerTask) => {
			console.time(workerTask.name);
			console.log(`${workerTask.name}: start`);

			const baseDirectory = await getBaseDirectory(workerTask.input);
			const baseFilePaths = await asyncGlob(workerTask.input);

			let files: Array<IFile> = [];

			for (const baseFilePath of baseFilePaths) {
				const content = await asyncReadFile(baseFilePath);
				const relativeFilePath = baseFilePath.replace(
					baseDirectory,
					""
				);

				files.push({
					path: relativeFilePath,
					content: content,
				});
			}

			const taskList = tasks[workerTask.taskIndex].tasks;

			for (const task of taskList) {
				files = await task(files);
			}

			console.timeEnd(workerTask.name);

			// @ts-ignore
			process.send("finished");
		});
	}
};

export { run };
