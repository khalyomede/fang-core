import { expect } from "chai";
import { run } from "../lib";

describe("fang", () => {
	describe("run", () => {
		it("should export a function", () =>
			expect(run).to.be.instanceOf(Function));

		it("should throw an exception if the first parameter is not an array", async () => {
			let exception = null;

			try {
				await run(42);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "tasks" must be an array`
			);
		});

		it("should throw an exception if a task is not an object", async () => {
			const task = 42;
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(TypeError);
			expect(exception.toString()).to.be.equal(
				`TypeError: "task[0]" must be an object`
			);
		});

		it("should throw an exception if a task does not have a name key", async () => {
			const task = {};
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].name" must be present`
			);
		});

		it("should throw an exception if a task does not have a tasks key", async () => {
			const task = { name: "" };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].tasks" must be present`
			);
		});

		it("should throw an exception if a task does not have an input key", async () => {
			const task = { name: "", tasks: [] };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].input" must be present`
			);
		});

		it("should throw an exception if a task does have a name key that is not a string", async () => {
			const task = { name: 42, tasks: [], input: "" };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(TypeError);
			expect(exception.toString()).to.be.equal(
				`TypeError: "task[0].name" must be a string`
			);
		});

		it("should throw an exception if a task does have a tasks key that is not an array", async () => {
			const task = { name: "", tasks: 42, input: "" };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(TypeError);
			expect(exception.toString()).to.be.equal(
				`TypeError: "task[0].tasks" must be an array`
			);
		});

		it("should throw an exception if a task does have an input key that is not a string", async () => {
			const task = { name: "", tasks: [], input: 42 };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(TypeError);
			expect(exception.toString()).to.be.equal(
				`TypeError: "task[0].input" must be a string`
			);
		});

		it("should throw an exception if a task does have an name key that is not filled", async () => {
			const task = { name: "", tasks: [], input: "" };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].name" must be filled`
			);
		});

		it("should throw an exception if a task does have an input key that is not filled", async () => {
			const task = { name: "html", tasks: [], input: "" };
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].input" must be filled`
			);
		});

		it("should throw an exception if a task does have a tasks key that is not filled", async () => {
			const task = {
				name: "html",
				tasks: [],
				input: "src/pug/index.pug",
			};
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].tasks" must be filled`
			);
		});

		it("should throw an exception if a task does have an input key that is not an existing file", async () => {
			const pug = () => files => files;
			const task = {
				name: "html",
				tasks: [pug()],
				input: "src/pug/index.pug",
			};
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(Error);
			expect(exception.toString()).to.be.equal(
				`Error: "task[0].input" must be an existing file`
			);
		});

		it("should throw an exception if a task does have an input key that is not an existing file", async () => {
			const pug = 42;
			const task = {
				name: "html",
				tasks: [pug],
				input: "test/fang.js",
			};
			let exception = null;

			try {
				await run([task]);
			} catch (error) {
				exception = error;
			}

			expect(exception).to.be.an.instanceOf(TypeError);
			expect(exception.toString()).to.be.equal(
				`TypeError: "task[0].tasks[0]" must be a function`
			);
		});
	});
});
