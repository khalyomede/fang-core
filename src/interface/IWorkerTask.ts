interface IWorkerTask {
	name: string;
	input: string;
	tasks: Array<Function>;
	outputDir: string;
	taskIndex: number;
}

export default IWorkerTask;
