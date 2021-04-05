# Fake REST API NodeJS

Get a full fake REST API with **zero coding** in **less than 30 seconds** ([NodeJS](https://nodejs.org/en/) + [JSON Server](https://github.com/typicode/json-server) + [JSON Webtoken](https://github.com/auth0/node-jsonwebtoken)).

Support JWT Bearer authentication:

- Login by email & password.
- Protect API by request methods. Default protected methods is "POST", "PUT", "PATCH", "DELETE".

*[Vietnamese documents](https://techmaster.vn/posts/35578/tao-1-rest-api-phuc-vu-cho-muc-dich-hoc-tap-trong-30-giay)*

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

or

```bash
npm run dev
```

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
- User can login by API `/login`, method `POST`, using email & password in resource `users`:

```
    {
        "email": "",
        "password": ""
    }
```

## Access & modify API

Please view detailed document in [https://github.com/typicode/json-server/blob/master/README.md#table-of-contents](https://github.com/typicode/json-server/blob/master/README.md#table-of-contents)

If you want to change logic of authentication, please edit file `server.js`.
