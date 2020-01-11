interface IWorkerTask {
	name: string;
	inputFilePath: string;
	tasks: Array<Function>;
	outputDir: string;
	taskIndex: number;
}

export default IWorkerTask;
