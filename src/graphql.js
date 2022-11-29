import { buildSchema } from "graphql";
import { ObjectScalarType } from "../utils/graphql-scalar-type.js";

export const schema = buildSchema(`
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

export const setupRootValue = (db) => {
  return {
    getObjects: ({ objectName }) => {
      const obj = db.data[objectName];
      return obj;
    },
    getObjectByKey: ({ objectName, objectKey, objectValue }) => {
      const obj = db.get(objectName).find((o) => {
        return (
          o[objectKey] ===
          (objectValue.int ?? objectValue.float ?? objectValue.string ?? objectValue.boolean)
        );
      });
      return obj;
    },
  };
};
