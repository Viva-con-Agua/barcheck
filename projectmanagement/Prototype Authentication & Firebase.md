![Firebase Logo](https://firebase.google.com/_static/images/firebase/touchicon-180.png)
# Firebase
Due to the fact that we disabled Basic Authentication for the Barcheck-App on SAP's Cloud Platform, we need a new way to authenticate. We decided to go with [Firebase](https://firebase.google.com/). Firebase is a box of tools google provides for developers to develop and analyze real-time applications. Google takes away the pressure of setting up a full blown infrastructure for a small project.
Key features of Firebase:

- NoSQL Real-Time Database
- Many build-in Analytics Functions
- Execute Nodejs-Functions to extend existing logic
- Crash Reporting
- Build-in Notifications and Cloud Messaging
- FREE Plan with enough resources for prototype state (see [Pricing](https://firebase.google.com/pricing/))

# What do we use Firebase for?
As mentioned we use Firebase Authentication Service to manage the server side implementation for signin, signout and session management of the users. There are several authentication methods that you can use:

# Implementation
## Setup
The Setup process is pretty much fast forward. To use Firebase the project that will use Firebase needs to be registered. Therefor enter the Firebase Console using your Google Account and create a project. Firebase will generate a peace of code you need to integrate into your coding. In our case it looks like the following:
```html
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKHkEojMxAp8V3NjxRyKETvCv1uiJ4XwE",
    authDomain: "vivaconagua-1500463121611.firebaseapp.com",
    databaseURL: "https://vivaconagua-1500463121611.firebaseio.com",
    projectId: "vivaconagua-1500463121611",
    storageBucket: "vivaconagua-1500463121611.appspot.com",
    messagingSenderId: "737806423559"
  };
  firebase.initializeApp(config);
</script>
```
That's it.

## How to use the tools?

## Create User
```javascript
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
});
```
## SignIn
```javascript
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  console.log(error.code);
  console.log(error.message);
});
```
## SignOut
```javascript
firebase.auth().signOut().then(function() {
  // ...
}).catch(function(error) {
  console.log(error.code);
  console.log(error.message);
});
```
