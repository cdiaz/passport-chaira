const Strategy = require('../src/strategy');

describe('Strategy test', () => {
  const strategy = new Strategy({
    clientID: 'ABC123',
    clientSecret: 'secret',
    callbackURL: 'http://localhost/auth/chaira/callback'
  }, () => { });

  it('should be named chaira', () => {
    expect(strategy.name).toBe('chaira');
  });

});