#!/usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");
const data = require("./src/data.json");

let args = process.argv;

args.splice(0, 2);

switch (args[0]) {
	case "-b": case "--build": {
		// directory location
		let path = "./";

		if (args[1]) {
			path += `${args[1]}/`;
		}

		// important tests
		if (!fs.existsSync(path)) {
			error(`Cannot locate directory: "${path}"`);
			break;
		}

		if (!fs.existsSync(path + "manifest.json")) {
			error("Cannot locate manifest.json");
			break;
		}

		// create bin/ if missing
		if (!fs.existsSync(path + "bin/")) {
			info(`Creating: "${path}bin/"`);
			fs.mkdirSync(path + "bin/");
		}

		// get manifest
		info("Reading manifest");
		let manifest = JSON.parse(fs.readFileSync(path + "manifest.json", "utf-8"));

		// insure main is specified
		if (!manifest.main) {
			error("No main script specified");
			break;
		}

		if (!fs.existsSync(path + manifest.main)) {
			error(`Cannot locate main script: ${path}${manifest.main}`);
			break;
		}

		// get meta
		let main = manifest.main;
		let author = manifest.author || "No Author Specified";

		let outPath = main.substring(0, main.lastIndexOf(".")) + ".js";

		let source = fs.readFileSync(path + manifest.main, "utf-8");

		// build
		info("Building...");

		let out = data.templates.js;

		{ // attach metadata
			out = out.replace("[APP_AUTHOR]", author);
		}

		{ // convert
			let indent = 0;

			let lines = source.split("\n").map(x => x.trim());

			lines.forEach((_line) => {
				if (_line.length == 0)
					return;

				let indents = "";

				if (indent > 0)
					indents = "\t".repeat(indent);

				let line = _line.match(/[^'"` ]+|"[^"]+"|'[^']+'|`[^`]+`/g);

				switch (line[0]) {
					case "using": {

					} break;

					case "function": {
						out += indents + "{\n";
						indent++;
					} break;

					case "}": {
						indent--;
						out += "\t".repeat(indent) + "}\n";
					} break;

					default: {
						let command = line.shift();
						let args = line.join(", ");

						out += indents + `${command}(${args});\n`;
					}
				}
			});
		}

		// write
		info("Writing...");
		
		fs.writeFileSync(`${path}bin/${outPath}`, out);

		// finish
		console.log([
			"",
			"Finished building",
			`Output location: ${path}bin/${outPath}`,
		].join("\n"));
	} break;

	case "-B": case "--build-html": {
		// directory location
		let path = "./";

		if (args[1]) {
			path += `${args[1]}/`;
		}

		// important tests
		if (!fs.existsSync(path)) {
			error(`Cannot locate directory: "${path}"`);
			break;
		}

		if (!fs.existsSync(path + "manifest.json")) {
			error("Cannot locate manifest.json");
			break;
		}

		// create bin/ if missing
		if (!fs.existsSync(path + "bin/")) {
			info(`Creating: "${path}bin/"`);
			fs.mkdirSync(path + "bin/");
		}

		// get manifest
		info("Reading manifest");
		let manifest = JSON.parse(fs.readFileSync(path + "manifest.json", "utf-8"));

		// get meta
		let main = manifest.main || "main.ferra";
		let name = manifest.name || "Untitled";
		let author = manifest.author || "No Author Specified";

		// build html
		info("Building...")

		let out = data.templates.html;

		out = out.replace("[APP_MAIN]", main.substring(0, main.lastIndexOf(".")) + ".js");
		out = out.replace("[APP_NAME]", name);
		out = out.replace("[APP_AUTHOR]", author);

		// write html
		info("Writing...");
		
		fs.writeFileSync(path + "bin/index.html", out);

		// finish
		console.log([
			"",
			"Finished building html",
			`Output location: ${path}bin/index.html`,
		].join("\n"));
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
			"operations;",
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
