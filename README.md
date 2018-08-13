# passport-chaira

[![Build](https://circleci.com/gh/cdiaz/passport-chaira.svg?style=svg)](https://circleci.com/gh/cdiaz/passport-chaira)


[Passport](http://passportjs.org/) strategy for authenticating with [Chairá](https://uniamazonia.edu.co)
using the OAuth 2.0 API.

This module lets you authenticate using your Chairá Account in your Node.js applications.
By plugging into Passport, Chairá authentication can be easily and
unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/) and [NestJS](http://nestjs.com/)

## Install

```bash
$ npm install passport-chaira
```

## Usage

#### Create an Application

Before using `passport-chaira`, you must register an application in Chairá for Developers.
If you have not already done so, a new application can be created at
[Chairá devs](htts://chaira.udla.edu.co/api_dev).
Your application will be issued a client ID and client
secret, which need to be provided to the strategy. You will also need to
configure a callback URL which matches the route in your application.

#### Configure Strategy

The Chairá authentication strategy authenticates users using a Chairá account and OAuth tokens. The strategy requires a verify callback, which accepts these credentials and calls done providing a user, as well as options specifying a client ID, client secret, and callback URL.

```js
var ChairaStrategy = require('passport-chaira').Strategy;

passport.use(new ChairaStrategy({
    clientID: CHAIRA_CLIENT_ID,
    clientSecret: CHAIRA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/chaira/callback",
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'chaira'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/chaira',
  passport.authenticate('chaira'));

app.get('/auth/chaira/callback', 
  passport.authenticate('chaira', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
_Keep in mind you also need to enable the `express-session` middleware for Chairá's `state` verification to work correctly_

## Support

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@cdiaz](https://github.com/cdiaz).


## License

[The MIT License](http://opensource.org/licenses/MIT)
