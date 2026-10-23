import "@kattebak/typespec-enum-emitter";

enum Status {
	Active,
	Inactive,
	Pending,
}

enum Priority {
	Low: "low",
	Medium: "medium",
	High: "high",
}

enum HttpStatusCode {
	OK: 200,
	NotFound: 404,
	InternalServerError: 500,
}

enum Escaping {
	Seen: "\\Seen",
	Quoted: "say \"hi\"",
	Newline: "line\nbreak",
	`quote"key`: "key with a quote",
	`back\\slash`: "key with a backslash",
}
