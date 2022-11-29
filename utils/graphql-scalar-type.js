import { GraphQLScalarType, Kind } from "graphql";

function parseLiteral(ast, variables) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, variables);
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return variables ? variables[name] : undefined;
    }
  }
}

function parseObject(ast, variables) {
  const value = Object.create(null);
  ast.fields.forEach((field) => {
    value[field.name.value] = parseLiteral(field.value, variables);
  });

  return value;
}

function ensureObject(value, ast) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw createGraphQLError(
      `JSONObject cannot represent non-object value: ${value}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined
    );
  }

  return value;
}

export const ObjectScalarType = new GraphQLScalarType({
  name: "Object",
  description: "Arbitrary object",
  parseValue: (value) => {
    return typeof value === "object" ? value : typeof value === "string" ? JSON.parse(value) : null;
  },
  serialize: (value) => {
    return typeof value === "object" ? value : typeof value === "string" ? JSON.parse(value) : null;
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`);
      default:
        return null;
    }
  },
});

export const JSONScalarType = new GraphQLScalarType({
  name: "JSON",
  description: "JSON values",
  parseValue: ensureObject,
  serialize: ensureObject,
  parseLiteral: parseObject,
});
