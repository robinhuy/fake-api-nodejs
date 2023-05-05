# Fake API NodeJS

Get a full fake API as soon as possible. Base on [NodeJS](https://nodejs.org/en/) + [JSON Server](https://github.com/typicode/json-server) + [Socket.IO](https://socket.io/).

Features:

- Define your own database using a JSON file, generate REST APIs from that database.

- Register user with username & password or email & password. Using object `users` in the database.

- Login with registered users.

- Protect resources using JWT Bearer authentication.

- Upload files.

- Send and receive messages over web socket connection (Socket.IO).

- Rewrite URL.

- Proxy Server.

## Getting started

### 1. Clone this repository

```bash
git clone https://github.com/robinhuy/fake-api-nodejs.git
```

or fork to your account and clone the forked repo

### 2. Install dependencies

```bash
cd fake-api-nodejs
npm install
```

or if you using yarn

```bash
cd fake-api-nodejs
yarn install
```

### 3. Run server

- Production mode:

  ```bash
  npm start
  ```

  or

  ```bash
  yarn start
  ```

- Development mode (auto reload server when editing using [nodemon](https://github.com/remy/nodemon)):

  ```bash
  npm run dev
  ```

  or

  ```bash
  yarn dev
  ```

- The server will run on `http://localhost:8000`. You can test with public endpoint: `http://localhost:8000/products` (GET method).

## Modify your data

All the data is stored in database.json. Edit it to suit your needs but keep the users object to utilize the authentication feature.

You can use [https://mockaroo.com/](https://mockaroo.com/) to generate mock data and then deploy your code to [https://heroku.com/](https://heroku.com/) or a similar hosting service to create a public API."

**Note**:

- To protect resources, declare the resources and protected methods in `database.json`:

  ```json
  "protectedResources": {
    "users": ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "products": ["POST", "PUT", "PATCH", "DELETE"]
  }
  ```

  If you don't need to protect any resources, simply delete the object above.

- To change the default port, database file, JWT secret, or JWT token expiration, ... modify the values in `config.js`.

## Access & modify API

Please view detailed document in [https://github.com/typicode/json-server/blob/master/README.md#table-of-contents](https://github.com/typicode/json-server/blob/master/README.md#table-of-contents)

If you want to modify the authentication logic or add more custom REST endpoints, please edit the `server.js` and `src/rest.js` files.

Edit `src/socket-io.js` to add or modify Socket.IO events, `src/graphql.js` to add or modify GraphQL query/mutation (currently, authentication aren't being applied to Socket.IO & GraphQl endpoints).

To add or modify Socket.IO events, edit the `src/socket-io.js` file. To add or modify GraphQL queries/mutations, edit the `src/graphql.js` file (currently, authentication isn't being applied to Socket.IO & GraphQL endpoints).

## Default Endpoints

To view and modify resources, access the `database.json` file.

### Open Endpoints

Open endpoints do not require Authentication.

#### User

Header: `Content-Type: application/json`.

- **POST /register**: Register a new user.

  ```
  {
    "firstName": "Administrator",
    "lastName": "",
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "admin",
    "avatar": "https://robohash.org/eaquequasincidunt.png?size=50x50&set=set1",
    "gender": "Genderfluid",
    "phone": "933-658-1213",
    "birthday": "1994-03-23",
    "status": true
  }
  ```

- **POST /login**: Login user.

  ```
  {
    "email": "admin@gmail.com",
    "password": "admin"
  }
  ```

  or

  ```
  {
    "username": "admin",
    "password": "admin"
  }
  ```

- **POST /refresh-token**: Get new access token from refresh token.

  ```
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NjMyNzE4NiwiZXhwIjoxNjU2MzI4MDg2fQ.-si1n7yHpjQ2LEyYqZT6ClIFJOqLOeVXRhwjzyvEZMo"
  }
  ```

#### Product

Header: `Content-Type: application/json`.

- **GET /products**: Return a list of all products.

- **GET /products/{id}**: Return information about a specific product.

#### Media

Header: `Content-Type: multipart/form-data`.

- **POST /upload-file**: Upload single file.

  | Parameter | Type | Description              |
  | --------- | ---- | ------------------------ |
  | file      | File | The file to be uploaded. |

- **POST /upload-files**: Upload multiple files.

  | Parameter | Type     | Description               |
  | --------- | -------- | ------------------------- |
  | files     | FileList | The files to be uploaded. |

### Private Endpoints (require Authentication)

Private endpoints require a valid token to be included in the request header. A token can be acquired from the Login API above.

Request header: `Content-Type: application/json` and `Authorization: Bearer {token}`

#### User

- **GET /users**: Return a list of all users.

- **GET /users/{id}**: Return information about a specific user.

- **POST /users**: Create a new user.

  Request is similar to the user registration API.

- **PUT /users/{id}**: Update the entire information of a specific user.

  Submit the entire user object except for the id field.

- **PATCH /users/{id}**: Update the partial information of a specific user.

  Submit the partial user object except for the id field.

#### Product

- **POST /products**: Create a new product.

  ```
  {
    "name": "Pork Salted Bellies",
    "price": 442,
    "quantity": 16,
    "thumbnail": "http://dummyimage.com/213x100.png/dddddd/000000",
    "status": true
  }
  ```

- **PUT /products/{id}**: Update the entire information of a specific product.

  Submit the entire product object except for the id field.

- **PATCH /products/{id}**: Update the partial information of a specific product.

  Submit the partial product object except for the id field.

### Web Socket (Socket.IO)

- Event `emit`: Echo message to sender

  ```js
  socket.emit('emit', 'Hello');
  ```

- Event `broadcast`: Broadcast message to all clients in the current namespace except the sender

  ```js
  socket.emit('broadcast', 'Hello');
  ```

- Event `broadcast-all`: Broadcast message to all clients in the current namespace include the sender

  ```js
  socket.emit('broadcast-all', 'Hello');
  ```

- Event `join-room`: Join a room

  ```js
  socket.emit('join-room', 'game');
  ```

- Event `emit-in-room`: Send message to all clients in the room except the sender

  ```js
  socket.emit('join-room', { room: 'game', event: 'chat', msg: 'Hello' });
  ```

### GraphQL

- Endpoint: `/graphql`.

- Get objects by name (objects declared in database.json)

  ```gql
  query getData($objectName: String!) {
    getObjects(objectName: $objectName)
  }
  ```

  Query variables:

  ```json
  {
    "objectName": "products"
  }
  ```

- Get an object by name, search by property

  ```gql
  query getData($objectName: String!, $objectKey: String!, $objectValue: ObjectValue) {
    getObjectByKey(objectName: $objectName, objectKey: $objectKey, objectValue: $objectValue)
  }
  ```

  ObjectValue must specify the data type:

  ```gql
  ObjectValue {
    int: Int
    float: Float
    string: String
    boolean: Boolean
  }
  ```

  Query variable examples:

  ```json
  {
    "objectName": "products",
    "objectKey": "id",
    "objectValue": {
      "int": 1
    }
  }
  ```

  ```json
  {
    "objectName": "products",
    "objectKey": "name",
    "objectValue": {
      "string": "Grapes - Black"
    }
  }
  ```

- Create an object

  ```gql
  query CreateObject($objectName: String!, $objectData: JSONScalarType!) {
    createObject(objectName: $objectName, objectData: $objectData)
  }
  ```

  Query variable examples:

  ```json
  {
    "objectName": "posts",
    "objectData": {
      "title": "New post"
    }
  }
  ```

- Update an object

  ```gql
  query UpdateObject($objectName: String!, $objectId: ID!, $objectData: JSONScalarType!) {
    updateObject(objectName: $objectName, objectId: $objectId, objectData: $objectData)
  }
  ```

  Query variable examples:

  ```json
  {
    "objectName": "posts",
    "objectId": "1",
    "objectData": {
      "title": "Update post"
    }
  }
  ```

- Delete an object

  ```gql
  query DeleteObject($objectName: String!, $objectId: ID!) {
    deleteObject(objectName: $objectName, objectId: $objectId)
  }
  ```

  Query variable examples:

  ```json
  {
    "objectName": "posts",
    "objectId": "1"
  }
  ```

  ...

## Rewrite URL

You can rewrite the URL by modifying the `url-rewrite.json` file.

For example, you can configure it to access **/api/products** instead of **/products** (default base URL rewrite rule).

## Proxy Server

If you want to create a proxy server to bypass CORS, you just need to set up **proxyServer** and **proxyUrl** in the `config.js` file.

For example, setting:

```
  proxyServer: 'http://example.org',
  proxyUrl: '/api',
```

will create a proxy server to forward API requests from `http://localhost:8000/api/foo/bar` to `http://example.org/api/foo/bar`.
