# Fake REST API NodeJS

Get a full fake REST API with **zero coding** in **less than 30 seconds** ([NodeJS](https://nodejs.org/en/) + [JSON Server](https://github.com/typicode/json-server) + [JSON Webtoken](https://github.com/auth0/node-jsonwebtoken)).

Support JWT authentication:

- Login by email & password.
- Protect API by request methods. Default protected methods is "POST", "PUT", "PATCH", "DELETE".

## Getting started

Clone this repository

```bash
git clone https://github.com/robinhuy/fake-rest-api-nodejs.git
```

Install dependencies

```bash
cd fake-rest-api-nodejs
npm install
```

Run server

```bash
npm start
```

## Modify your data

All the data was placed in `database.json`. Edit it to suit your purpose.

You can use [https://mockaroo.com/](https://mockaroo.com/) to mock data, and publish your code to [https://heroku.com/](https://heroku.com/) to get a Public API.

**Note**: `users` is used to authenticate, the others is just demo data.

## Access & modify API

Please view detailed document in [https://github.com/typicode/json-server/blob/master/README.md#table-of-contents](https://github.com/typicode/json-server/blob/master/README.md#table-of-contents)

If you want to change logic of authentication, please edit file `server.js`.
