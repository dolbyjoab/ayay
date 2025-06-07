const querystring = require('querystring');
const crypto = require('crypto');

exports.handler = async function (event, context) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const redirectUri = `https://${event.headers.host}/.netlify/functions/auth-callback`;
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  const authUrl = `https://api.twitter.com/2/oauth2/authorize?` +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'users.read tweet.read tweet.write offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Strict`
    },
    body: ''
  };
};