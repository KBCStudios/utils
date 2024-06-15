import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: [
		"./src/index",
		"./src/Logger",
		"./src/types.ts",
		"./src/images/index.ts",
		"./src/images/rei.ts",
		"./src/images/soi.ts",
	],
	outDir: "dist",
	declaration: "compatible",
	failOnWarn: false,
});
