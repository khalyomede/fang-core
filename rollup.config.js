import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	plugins: [
		nodeResolve({
			preferBuiltins: true,
		}),
		commonjs(),
		typescript(),
	],
	output: {
		file: "lib/index.js",
		format: "cjs",
	},
};
