export interface EnumEmitterOptions {
	"output-file"?: string;
	"emitter-output-dir"?: string;
	"package-name"?: string;
	"package-version"?: string;
}

export const $lib = {
	"emitter-options-schema": {
		type: "object",
		additionalProperties: false,
		properties: {
			"output-file": { type: "string", nullable: true, default: "enums.js" },
			"emitter-output-dir": {
				type: "string",
				format: "absolute-path",
				nullable: true,
			},
			"package-name": { type: "string", nullable: true },
			"package-version": { type: "string", nullable: true, default: "0.0.1" },
		},
		required: [],
	} as const,
};
