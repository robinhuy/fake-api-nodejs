const { buildSchema } = require("graphql");
const { ObjectScalarType } = require("../utils/graphql-scalar-type");

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

const setupRootValue = (db) => {
  return {
    getObjects: ({ objectName }) => {
      const obj = db.get(objectName).value();
      return obj;
    },
    getObjectByKey: ({ objectName, objectKey, objectValue }) => {
      const obj = db
        .get(objectName)
        .find((o) => {
          return (
            o[objectKey] ===
            (objectValue.int ??
              objectValue.float ??
              objectValue.string ??
              objectValue.boolean)
          );
        })
        .value();
      return obj;
    },
  };
};

module.exports = {
  schema,
  setupRootValue,
};
