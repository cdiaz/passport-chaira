import { Strategy as OAuth2Strategy, InternalOAuthError } from "passport-oauth2";

const baseURL = path => `https://chaira.udla.edu.co/ChairaApi/${path}`;

const defaultOptions = {
  scopeSeparator: ',',
  authorizationURL: baseURL('oauth2/auth'),
  tokenURL: baseURL('oauth2/token'),
  userProfileURL: baseURL('consultar?recurso=GjR9jrQ4mrF'),
  state: true,
  customHeaders: {'Content-Type': 'application/json'}
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

  userProfile(accessToken, done) {
    var headers = {
      'Authorization': accessToken
    }
    this._oauth2._request(
      'GET',
      this._userProfileURL,
      headers,
      null,
      null,
      (err, body, response) => {
        if (err) {
          return done(new InternalOAuthError('Failed to fetch user profile', err))
        }
        try {
          let { data: user } = JSON.parse(body.replace('{"d":null}', ''));
          user = user[0]
          const profile = {
            provider: 'chaira',
            id: user.ID_USUARIO,
            displayName: user.NOMBRE,
            email: user.CORREO,
            picture: user.FOTO,
            gender: user.GENERO,
            age: user.EDAD
          };
          return done(null, profile)
        } catch (e) {
          done(e);
        }
      }
    )
  }
}