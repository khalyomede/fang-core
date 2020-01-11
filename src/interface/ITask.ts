interface ITask {
	name: string;
	inputFilePath: string;
	tasks: Array<Function>;
}

export default ITask;
