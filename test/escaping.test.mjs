import assert from "node:assert/strict";
import { test } from "node:test";
import { Escaping } from "../build/ts-enums/enums.js";

test("string values keep backslashes, quotes and newlines", () => {
	assert.equal(Escaping.Seen, "\\Seen");
	assert.equal(Escaping.Quoted, 'say "hi"');
	assert.equal(Escaping.Newline, "line\nbreak");
});

test("keys keep quotes and backslashes", () => {
	assert.equal(Escaping['quote"key'], "key with a quote");
	assert.equal(Escaping["back\\slash"], "key with a backslash");
});
