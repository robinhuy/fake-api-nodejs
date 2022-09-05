const { buildSchema, GraphQLScalarType } = require("graphql");

const ObjectScalarType = new GraphQLScalarType({
  name: "Object",
  description: "Arbitrary object",
  parseValue: (value) => {
    return typeof value === "object"
      ? value
      : typeof value === "string"
      ? JSON.parse(value)
      : null;
  },
  serialize: (value) => {
    return typeof value === "object"
      ? value
      : typeof value === "string"
      ? JSON.parse(value)
      : null;
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

const schema = buildSchema(`
  scalar ObjectScalarType

  input ObjectValue {
    int: Int
    float: Float
    string: String
    boolean: Boolean
  }

  type Query {
    getObjects(objectName: String!): [ObjectScalarType]
    getObjectByKey(objectName: String!, objectKey: String!, objectValue: ObjectValue): ObjectScalarType
  }
`);

module.exports = {
  schema,
};
