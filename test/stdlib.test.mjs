import assert from "node:assert/strict";
import { test } from "node:test";

const withStdlib = await import("../build/stdlib-default/enums.js");
const withoutStdlib = await import("../build/stdlib-excluded/enums.js");

test("emits stdlib enums alongside user enums by default", () => {
	for (const name of [
		"ApiKeyLocation",
		"ArrayEncoding",
		"AuthType",
		"BytesKnownEncoding",
		"DateTimeKnownEncoding",
		"DurationKnownEncoding",
		"Lifecycle",
		"MergePatchVisibilityMode",
		"OAuth2FlowType",
		"OrderState",
	]) {
		assert.ok(name in withStdlib, `${name} is missing`);
	}
});

test("exclude-stdlib emits only enums outside the TypeSpec namespace", () => {
	assert.deepEqual(Object.keys(withoutStdlib), ["OrderState"]);
	assert.deepEqual(withoutStdlib.OrderState, withStdlib.OrderState);
});
