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

	const emitted = context.options["exclude-stdlib"]
		? enums.filter((enumType) => !isStdlibEnum(globalNamespace, enumType))
		: enums;

	if (emitted.length === 0) {
		return;
	}

	const outputDir = context.emitterOutputDir;
	const outputFile = context.options["output-file"] ?? "enums.js";
	const packageName = context.options["package-name"];
	const packageVersion = context.options["package-version"] ?? "0.0.1";

	const jsContent = generateJavaScript(emitted);
	const tsContent = generateTypeScript(emitted);

	await emitFile(context.program, {
		path: resolvePath(outputDir, outputFile),
		content: jsContent,
	});

	await emitFile(context.program, {
		path: resolvePath(outputDir, outputFile.replace(".js", ".d.ts")),
		content: tsContent,
	});

	// Generate package.json if package-name is provided
	if (packageName) {
		const packageJson = generatePackageJson(packageName, packageVersion);
		await emitFile(context.program, {
			path: resolvePath(outputDir, "package.json"),
			content: packageJson,
		});
	}
}

function isStdlibEnum(globalNamespace: Namespace, enumType: Enum): boolean {
	const stdlibNamespace = globalNamespace.namespaces.get("TypeSpec");
	let namespace = enumType.namespace;
	while (namespace) {
		if (namespace === stdlibNamespace) {
			return true;
		}
		namespace = namespace.namespace;
	}
	return false;
}

function generateJavaScript(enums: Enum[]): string {
	const enumDefinitions = enums
		.map((enumType) => {
			const members = Array.from(enumType.members.values());
			const enumObject = generateEnumObject(members);

			return `export const ${enumType.name} = ${enumObject};`;
		})
		.join("\n\n");

	return enumDefinitions;
}

function generateEnumObject(members: EnumMember[]): string {
	const entries = members
		.map((member) => {
			const key = member.name;
			const value = member.value ?? member.name;
			const valueStr =
				typeof value === "string" ? JSON.stringify(value) : value;
			return `\t${JSON.stringify(key)}: ${valueStr}`;
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
					const valueStr =
						typeof value === "string" ? JSON.stringify(value) : value;
					return `\treadonly ${JSON.stringify(key)}: ${valueStr}`;
				})
				.join(";\n");

			return `export declare const ${enumType.name}: {\n${memberTypes}\n};`;
		})
		.join("\n\n");

	return `${enumDeclarations}\n`;
}

function generatePackageJson(name: string, version: string): string {
	const packageJson = {
		name,
		version,
		type: "module",
		main: "enums.js",
		types: "enums.d.ts",
	};

	return JSON.stringify(packageJson, null, 2);
}
