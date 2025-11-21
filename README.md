# TypeSpec Enum Emitter

A custom TypeSpec emitter that exports enums as JavaScript const objects with proper TypeScript type definitions.

## Features

- Converts TypeSpec enums to JavaScript const objects
- Generates TypeScript declaration files (.d.ts)
- Supports string and numeric enum values
- Uses the TypeSpec emitter framework

## Installation

```bash
npm install typespec-enum-emitter
```

## Usage

### 1. Create a TypeSpec file with enums

```typespec
import "typespec-enum-emitter";

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
```

### 2. Configure tspconfig.yaml

```yaml
emit:
  - @kattebak/typespec-enum-emitter
options:
  typespec-enum-emitter:
    output-file: "enums.js"
```

### 3. Compile

```bash
npx tsp compile .
```

### 4. Generated Output

**enums.js:**

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

export const Status = {
  Active: "Active",
  Inactive: "Inactive",
  Pending: "Pending",
};

export const Priority = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

export const HttpStatusCode = {
  OK: 200,
  NotFound: 404,
  InternalServerError: 500,
};
```

**enums.d.ts:**

```typescript
export declare const Status: {
  readonly Active: "Active";
  readonly Inactive: "Inactive";
  readonly Pending: "Pending";
};

export declare const Priority: {
  readonly Low: "low";
  readonly Medium: "medium";
  readonly High: "high";
};

export declare const HttpStatusCode: {
  readonly OK: 200;
  readonly NotFound: 404;
  readonly InternalServerError: 500;
};
```

## Configuration Options

- `output-file`: Name of the output file (default: "enums.js")
- `output-dir`: Output directory (defaults to emitter output directory)

## Why Use This?

TypeScript enums have some quirks:

- They generate runtime code that can be hard to tree-shake
- Const enums don't preserve values at runtime
- Regular enums can have unexpected behavior with numeric values

This emitter generates simple const objects that:

- Are fully tree-shakeable
- Have clear runtime behavior
- Work seamlessly with TypeScript's type system
- Are easy to inspect and debug

## Implementation

Built using the TypeSpec emitter framework with:

- `@typespec/compiler` for AST traversal
- Namespace-aware enum collection
- Proper TypeScript declaration generation
