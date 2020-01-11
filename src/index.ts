import { ITask, IWorkerTask } from "./interface";
import { cpus } from "os";
import { fork, isMaster, isWorker, on } from "cluster";
import { promisify } from "util";
import { readFile, writeFile, mkdir } from "fs";
import { basename } from "path";

const asyncReadFile = promisify(readFile);
const asyncWriteFile = promisify(writeFile);
const asyncMkdir = promisify(mkdir);

const run = async (tasks: Array<ITask>) => {
	if (isMaster) {
		console.time("fang");
		console.log("fang: start");

		const numberOfCpus = cpus().length;
		let remainingTaskCount = tasks.length;

		console.log(`${numberOfCpus} CPUs core(s)`);
		console.log(`${remainingTaskCount} tasks to run`);

		for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
			const task = tasks[taskIndex];
			const worker = fork();

			worker.send({
				...task,
				taskIndex: taskIndex,
			});
		}

		on("exit", () => {
			remainingTaskCount--;

			if (remainingTaskCount === 0) {
				console.timeEnd("fang");

				process.exit(0);
			}
		});
	} else if (isWorker) {
		process.on("message", async (workerTask: IWorkerTask) => {
			console.time(workerTask.name);
			console.log(`${workerTask.name}: start`);

			let content = await asyncReadFile(workerTask.inputFilePath);
			const taskList = tasks[workerTask.taskIndex].tasks;

			for (const task of taskList) {
				content = await task(content);
			}

			await asyncMkdir(workerTask.outputDir, {
				recursive: true,
			});
			await asyncWriteFile(
				`${workerTask.outputDir}/${basename(workerTask.inputFilePath)}`,
				content
			);

			console.timeEnd(workerTask.name);

			process.exit(0);
		});
	}
};

export { run };
