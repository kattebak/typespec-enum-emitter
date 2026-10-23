import { Escaping } from "../build/ts-enums/enums.js";

const seen: "\\Seen" = Escaping.Seen;
const quoted: 'say "hi"' = Escaping.Quoted;
const newline: "line\nbreak" = Escaping.Newline;
const quoteKey: "key with a quote" = Escaping['quote"key'];
const backslashKey: "key with a backslash" = Escaping["back\\slash"];

export { backslashKey, newline, quoted, quoteKey, seen };
