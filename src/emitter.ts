import type { EmitContext } from "@typespec/compiler";
import {
	type Enum,
	type EnumMember,
	emitFile,
	type Namespace,
	resolvePath,
} from "@typespec/compiler";
import type { EnumEmitterOptions } from "./lib.js";

export async function $onEmit(context: EmitContext<EnumEmitterOptions>) {
	const enums: Enum[] = [];

	function collectEnums(namespace: Namespace) {
		for (const [_, type] of namespace.enums) {
			enums.push(type);
		}

		for (const [_, ns] of namespace.namespaces) {
			collectEnums(ns);
		}
	}

	const globalNamespace = context.program.getGlobalNamespaceType();
	collectEnums(globalNamespace);

	if (enums.length === 0) {
		return;
	}

	const outputDir = context.emitterOutputDir;
	const outputFile = context.options["output-file"] ?? "enums.js";

	const jsContent = generateJavaScript(enums);
	const tsContent = generateTypeScript(enums);

	await emitFile(context.program, {
		path: resolvePath(outputDir, outputFile),
		content: jsContent,
	});

	await emitFile(context.program, {
		path: resolvePath(outputDir, outputFile.replace(".js", ".d.ts")),
		content: tsContent,
	});
}

function generateJavaScript(enums: Enum[]): string {
	const enumDefinitions = enums
		.map((enumType) => {
			const members = Array.from(enumType.members.values());
			const enumObject = generateEnumObject(members);

			return `export const ${enumType.name} = ${enumObject};`;
		})
		.join("\n\n");

	return `"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n\n${enumDefinitions}\n`;
}

function generateEnumObject(members: EnumMember[]): string {
	const entries = members
		.map((member) => {
			const key = member.name;
			const value = member.value ?? member.name;
			const valueStr = typeof value === "string" ? `"${value}"` : value;
			return `\t${key}: ${valueStr}`;
		})
		.join(",\n");

	return `{\n${entries}\n}`;
}

function generateTypeScript(enums: Enum[]): string {
	const enumDeclarations = enums
		.map((enumType) => {
			const members = Array.from(enumType.members.values());
			const memberTypes = members
				.map((member) => {
					const key = member.name;
					const value = member.value ?? member.name;
					const valueStr = typeof value === "string" ? `"${value}"` : value;
					return `\treadonly ${key}: ${valueStr}`;
				})
				.join(";\n");

			return `export declare const ${enumType.name}: {\n${memberTypes}\n};`;
		})
		.join("\n\n");

	return `${enumDeclarations}\n`;
}
