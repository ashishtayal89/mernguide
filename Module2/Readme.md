## Module 2

In this module we will be building an uptime monitor app which allows users to enter urls they want to monitor and receive alerts when those resources go down and come back up.

Features :

1. The users can sign-up and sign-in the app.
2. The user will get uptime alerts via sms rather than emails.

API Requirement :

1. API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE.
2. API allows to create a new user, edit and delete that user.
3. API allows a user to sign in based on authentication token used for subsequent request.
4. API allows the user to sign out and invalidate the auth token.
5. API allows the user to add a new check to monitor the state of an endpoint. This is allowed onl to authenticated users.
6. API allows the user to edit or delete any check.
7. In the background the API performs all the checks at the appropritate times and send alerts to the users when the check changes its state. For this we will use node to connect to Twilio api.

### Parsing Request

1. First we create a http server and make it to listen at port 3000.
2. Then we parse the request to the the path and log that path.
3. Log request method
4. Log the query string parameter. Also please refer to https://youtu.be/7pwHtlD-u6U video which explain some issues related to implict conversion of object to string as in the case of queryStringParam object.
5. Parsing the request payload.

History of UTF character encoding -> https://www.youtube.com/watch?v=MijmeoH9LT4

Request payload/body is recieved in the form of a stream of bits/bytes. This stream is first decoded based on some charater encoding scheme like utf-8 and then stored in a buffer. This buffer is updated everytime a new stream of payload is recieved. Finaly when the request has ended the buffer is considered complete and can be used to get the request payload/body data from it.

```javascript
fetch(`http://localhost:3000/foo?name=Ashish`, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    customHeader: "This is custom header"
  },
  body: JSON.stringify({ name: "Ashish" })
});
```

### Routing Request

1. We have created some handlers based on the request path. These handlers are requeired to do some pre-processing task and then pass the control to a callback. This is the same way express handles different get/post request based on routes.
2. We have set the response content type to `application/json`. This informs the client that the response is a json and so it handles it accordingly.

### Adding Config

1. We pass the `NODE_ENV` variable from command line to node.
2. Then we use this variable to fetch environment specific config from the config file.

### Add HTTPS support

1. First we create `cert.pem` and `key.pem` using the command `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`.
2. Then we add port for https for both staging and production.
3. Then we create a https server to give support for https request.
   - We first create a function unifiedServer which will have the common logic for both http and https server.
   - Then we create a separate https server using nodes https module.
   - We need to provide 2 things as part of configuration to the https server 1 is key and other is cert. We do this by reading th contests of the key.pem and cert.pem file using nodes fs module.
4. Then we get rid of the sample route and add a ping route instead.

### Store Data

1. Since we are not using any data base for this application we are managing all the data in the filesystem. For that we have created a folder `.data` which will hold all the data related files in it. So this folder acts as a database for us. Inside this folder we will have different subdirectories which would represent different tables of a database Eg Users folder would hold all the data files related to a user. These data files represent single record in a RDBMS.

2. Secondly we create a lib folder which would have all the libraries of this project. Inside this folder we create a file `data.js` which contains all the CRUD operation to perform on the data files.

### User Service

1. In this section we will be creating an api which will be responsibe to do different user operation. We start by first moving the handlers logic out of the index file to a `handler.js` lib file.

- Sample User Request

```javascript
fetch(`http://localhost:3000/users`, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    customHeader: "This is custom header"
  },
  body: JSON.stringify({
    firstName: "Ashish",
    lastName: "Tayal",
    phone: "9822889472",
    password: "123",
    tosAgreement: true
  })
});
```

### Tokens Service

- Sample Token Request

```javascript
fetch(`http://localhost:3000/tokens`, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    customHeader: "This is custom header"
  },
  body: JSON.stringify({ phone: "9822889472", password: "123" })
});
```

### Checks Service

- Sample Checks Request

```javascript
fetch(`http://localhost:3000/checks`, {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: { token: "6dmcp0y0l7dtrhik05ue" },
  body: JSON.stringify({
    protocol: "http",
    url: "yahoo.com",
    method: "get",
    successCodes: [200, 201],
    timeoutSeconds: 3
  })
});
```

### Connect To Api

1. Generaly for any integrating with a 3rd party service you would go to their documentation and look for a npm package which supports the integraion.
