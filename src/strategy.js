import OAuth2Strategy from 'passport-oauth2';

const baseURL = path => `http://chaira.udla.edu.co/api/v0.1/oauth2/${path}`;

const defaultOptions = {
  scopeSeparator: ',',
  authorizationURL: baseURL('authorize.asmx/auth'),
  tokenURL: baseURL('authorize.asmx/token'),
  userProfileURL: baseURL('resource.asmx/scope'),
  state: true,
  customHeaders: { 'Content-Type': 'application/json' }
}

export default class Strategy extends OAuth2Strategy {
  constructor(userOptions = {}, verify) {

    const options = Object.assign({}, defaultOptions, userOptions);
    super(options, verify);

    if (!options.clientID) {
      throw new Error("Strategy cannot be called until you provide a clientID");
    }
    if (!this._oauth2._clientSecret) {
      throw new Error("Strategy cannot be called until you provide a clientSecret");
    }
    if (!options.callbackURL) {
      throw new Error("Strategy requires a callbackURL");
    }

    this.name = 'chaira';
    this._userProfileURL = options.userProfileURL;

    this._oauth2.getOAuthAccessToken = function (code, params, callback) {
      this._request(
        'POST',
        this._getAccessTokenUrl(),
        this._customHeaders,
        JSON.stringify({
          ...params,
          code: code,
          client_id: this._clientId,
          client_secret: this._clientSecret,
          state: options.state
        }),
        null,
        (err, body, response) => {
          if (err) return callback(err)
          if (response.statusCode === 403) { return callback(403, null) }
          let { access_token, refresh_token } = JSON.parse(body.replace('{"d":null}', ''));
          callback(null, access_token, refresh_token, params);
        }
      );
    }
  }

  userProfile(accessToken, callback) {
    this._oauth2._request(
      'POST',
      this._userProfileURL,
      this._oauth2._customHeaders,
      JSON.stringify({
        access_token: accessToken,
        scope: 'public_profile'
      }),
      null,
      (err, body, response) => {
        if (err) { return done(new Error('Failed to fetch user profile', err)) }
        if (response.statusCode === 403) { return callback(403, null) }
        let { description: raw } = JSON.parse(body.replace('{"d":null}', ''));
        try {
          let profile = JSON.parse(raw)[0];
          callback(null, profile);
        } catch (e) {
          callback(e);
        }
      }
    )
  }
}