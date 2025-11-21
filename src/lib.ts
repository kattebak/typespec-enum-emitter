export interface EnumEmitterOptions {
	"output-dir"?: string;
	"output-file"?: string;
}

export const $lib = {
	"emitter-options-schema": {
		type: "object",
		additionalProperties: false,
		properties: {
			"output-dir": { type: "string", nullable: true },
			"output-file": { type: "string", nullable: true, default: "enums.js" },
		},
		required: [],
	} as const,
};
