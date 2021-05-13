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
