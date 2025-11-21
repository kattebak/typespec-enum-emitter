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
