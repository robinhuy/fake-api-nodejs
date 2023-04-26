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

Preview: [https://nodejs-fake-api.herokuapp.com](https://nodejs-fake-api.herokuapp.com/)

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

All the data was placed in `database.json`. Edit it to suit your purpose but keep object `users` to use authentication feature.

You can use [https://mockaroo.com/](https://mockaroo.com/) to mock data, and publish your code to [https://heroku.com/](https://heroku.com/) or similar hosting to get a Public API.

**Note**:

- To protect resources, decleare resources and protected methods in `database.json`:

  ```json
  "protectedResources": {
    "users": ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "products": ["POST", "PUT", "PATCH", "DELETE"]
  }
  ```

- To register new user, using endpoint `/register`, method `POST`, request type `application/json`. Body request like `users` resources:

- To login, using endpoint `/login`, method `POST`, request type `application/json`. Body request like this:

  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```

  or

  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin"
  }
  ```

- To renew AccessToken, using endpoint `/refresh-token`, method `POST`, request type `application/json`. Body request like this:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NjMyNzE4NiwiZXhwIjoxNjU2MzI4MDg2fQ.-si1n7yHpjQ2LEyYqZT6ClIFJOqLOeVXRhwjzyvEZMo"
  }
  ```

- To upload single file, using endpoint `/upload-file`, method `POST`, request type `form-data`, field `file`. Uploaded file stored in `/public/uploads/`.

- To upload multiple files, using endpoint `/upload-files`, method `POST`, request type `form-data`, field `files`. Uploaded files stored in `/public/uploads/`.

- Change default port, database file, jwt secret or jwt token expires in `config.js`.

## Access & modify API

Please view detailed document in [https://github.com/typicode/json-server/blob/master/README.md#table-of-contents](https://github.com/typicode/json-server/blob/master/README.md#table-of-contents)

If you want to change logic of authentication or add more custom REST endpoints, please edit file `server.js` and `src/rest.js`.

Edit `src/socket-io.js` to add or modify Socket.IO events, `src/graphql.js` to add or modify GraphQL query/mutation (currently, authentication aren't being applied to Socket.IO & GraphQl endpoints).

## Default Endpoints

View and modify resources in `database.json`.

### Open Endpoints

Open endpoints do not require Authentication.

#### User

- Login: POST /login

- Register: POST /register

#### Product

- Get products: GET /products

- Get product by ID: GET /products/:id

#### Media

- Upload single file: POST /upload-file

- Upload multiple files: POST /upload-files

### Private Endpoints (require Authentication)

Private endpoints require a valid Token to be included in the header of the request. A Token can be acquired from the Login view above.

#### User

- Get users: GET /users

- Get user by ID: GET /users/:id

- Create user: POST /users

- Update user (entire information): PUT /users/:id

- Update user (partial information) PATCH /users/:id

#### Product

- Create product: POST /products

- Update product (entire information): PUT /products/:id

- Update product (partial information) PATCH /products/:id

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
  query getData(
    $objectName: String!
    $objectKey: String!
    $objectValue: ObjectValue
  ) {
    getObjectByKey(
      objectName: $objectName
      objectKey: $objectKey
      objectValue: $objectValue
    )
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
  query UpdateObject(
    $objectName: String!
    $objectId: ID!
    $objectData: JSONScalarType!
  ) {
    updateObject(
      objectName: $objectName
      objectId: $objectId
      objectData: $objectData
    )
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

If you want to create a proxy server to bypass CORS, you just need to set up **proxyServer** and **proxyUrl** in the `config.js` file

For example, setting:

```
  proxyServer: 'http://example.org',
  proxyUrl: '/api',
```

will create a proxy server to forward API requests from `http://localhost:8000/api/foo/bar` to `http://example.org/api/foo/bar`.

