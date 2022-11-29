import { buildSchema } from "graphql";
import { ObjectScalarType, JSONScalarType } from "../utils/graphql-scalar-type.js";

export const schema = buildSchema(`
  scalar ObjectScalarType
  scalar JSONScalarType

  input ObjectValue {
    int: Int
    float: Float
    string: String
    boolean: Boolean
  }

  type ResponseMessage {
    id: ID
    code: String
    message: String
  }

  type Query {
    getObjects(objectName: String!): [ObjectScalarType]
    getObjectByKey(objectName: String!, objectKey: String!, objectValue: ObjectValue): ObjectScalarType
  }

  type Mutation {
    createObject(objectName: String!, objectData: JSONScalarType!): ResponseMessage
    updateObject(objectName: String!, objectId: ID!, objectData: JSONScalarType!): ResponseMessage
    deleteObject(objectName: String!, objectId: ID!): ResponseMessage
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

    createObject: ({ objectName, objectData }) => {
      if (!db.data[objectName]) {
        db.data[objectName] = [];
      }

      const objects = db.data[objectName];
      let maxId = 0;
      for (let o of objects) {
        if (o.id > maxId) {
          maxId = o.id;
        }
      }
      const newObject = { id: maxId + 1, ...objectData };

      objects.push(newObject);
      db.write();

      return {
        id: newObject.id,
        code: 200,
        message: "Create object successfully!",
      };
    },

    updateObject: ({ objectName, objectId, objectData }) => {
      if (!db.data[objectName]) {
        return {
          code: 404,
          message: "Object type not found!",
        };
      }

      let object = db.data[objectName].find((o) => o.id == objectId);
      if (!object) {
        return {
          code: 404,
          message: "Object not found!",
        };
      }

      const { id, ...objectDataWithoutId } = objectData;
      for (let key in objectDataWithoutId) {
        object[key] = objectDataWithoutId[key];
      }
      db.write();

      return {
        id: objectId,
        code: 200,
        message: "Update object successfully!",
      };
    },

    deleteObject: ({ objectName, objectId }) => {
      if (!db.data[objectName]) {
        return {
          code: 404,
          message: "Object type not found!",
        };
      }

      const objects = db.data[objectName];
      const objectIndex = objects.findIndex((o) => o.id == objectId);
      if (objectIndex === -1) {
        return {
          code: 404,
          message: "Object not found!",
        };
      }

      objects.splice(objectIndex, 1);
      db.write();

      return {
        id: objectId,
        code: 200,
        message: "Delete object successfully!",
      };
    },
  };
};
