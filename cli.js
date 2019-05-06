#!/usr/bin/env node
const chalk = require("chalk");

let args = process.argv;

args.splice(0, 2);

switch (args[0]) {
	default: {
		let lines = [];

		if (args[0]) {
			lines.push(
				`${chalk.yellow("[WARN]")} Invalid arguments provided`,
				`${chalk.yellow("[WARN]")} Cannot find operation: "${args[0]}"`,
				"",
			);
		}

		lines.push(
			"usage: ferramenta operation [directory]",
			"",
			"operation;",
			"\t-b, --build\tbuilds project in the specified directory",
		);

		console.log(lines.join("\n"));
	}
}
