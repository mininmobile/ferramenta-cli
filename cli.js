#!/usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");

let args = process.argv;

args.splice(0, 2);

switch (args[0]) {
	case "-b": case "--build": {
		error("Not implemented");
	} break;

	case "-B": case "--build-html": {
		let path = "./";

		if (args[1]) {
			path += `${args[1]}/`;
		}

		if (!fs.existsSync(path)) {
			error(`Cannot locate directory: "${path}"`);
			break;
		}

		if (!fs.existsSync(path + "manifest.json")) {
			error("Cannot locate manifest.json");
			break;
		}

		info("Reading manifest");
		let manifest = require("./manifest.json");

		if (!fs.existsSync(path + "bin/")) {
			info("No bin directory yet");
			fs.mkdirSync(path + "bin/");
		}
	} break;

	default: {
		let lines = [];

		if (args[0]) {
			warn("Invalid arguments provided");
			warn(`Cannot find operation: "${args[0]}"`);

			lines.push("");
		}

		lines.push(
			"usage: ferramenta operation [directory]",
			"",
			"operation;",
			"\t-b, --build       builds project in the specified directory",
			"\t-B, --build-html  builds html file of project in the specified directory"
		);

		console.log(lines.join("\n"));
	}
}

function error(text) {
	console.log(`${chalk.red("[ERR]")} ${text}`);
}

function warn(text) {
	console.log(`${chalk.yellow("[WARN]")} ${text}`);
}

function info(text) {
	console.log(`${chalk.blueBright("[INFO]")} ${text}`);
}
