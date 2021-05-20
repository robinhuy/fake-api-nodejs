# Fake REST API NodeJS

Get a full fake REST API with **zero coding** in **less than 30 seconds** ([NodeJS](https://nodejs.org/en/) + [JSON Server](https://github.com/typicode/json-server) + [JSON Webtoken](https://github.com/auth0/node-jsonwebtoken)).

Support JWT Bearer authentication:

- Register user with username & password or email & password.

- Login with registered users.

- Protect API by resource and request methods.

Support upload files (beta).

*[Vietnamese documents](https://techmaster.vn/posts/35578/tao-1-rest-api-phuc-vu-cho-muc-dich-hoc-tap-trong-30-giay)*

## Getting started

Clone this repository

```bash
git clone https://github.com/robinhuy/fake-rest-api-nodejs.git
```

(or fork to your account and clone the forked repo)

Install dependencies

```bash
cd fake-rest-api-nodejs
npm install
```

Run server

```bash
npm start
```

or

```bash
npm run dev
```

The server will run on `http://localhost:3000`.
Public API: `http://localhost:3000/products` (GET method).

## Modify your data

All the data was placed in `database.json`. Edit it to suit your purpose.

You can use [https://mockaroo.com/](https://mockaroo.com/) to mock data, and publish your code to [https://heroku.com/](https://heroku.com/) to get a Public API.

**Note**:
- To protect resources, decleare resources and protected methods in `database.json`:

```
    "protected_resources": {
        "users": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "products": ["POST", "PUT", "PATCH", "DELETE"]
    }
```

- User can login by API `/login`, method `POST`, using `username & password` or `email & password` in resource `users`. Body request like this:

```
    {
        "email": "admin",
        "password": "admin"
    }
```

- Change default port, database file, jwt secret or jwt token expires in `config.json`.

## Access & modify API

Please view detailed document in [https://github.com/typicode/json-server/blob/master/README.md#table-of-contents](https://github.com/typicode/json-server/blob/master/README.md#table-of-contents)

If you want to change logic of authentication or add more feature, please edit file `server.js`.
