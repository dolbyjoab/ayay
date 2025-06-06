const querystring = require('querystring');

exports.handler = async function (event, context) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const redirectUri = `https://${event.headers.host}/.netlify/functions/auth-callback`;
  const authUrl = `https://api.twitter.com/2/oauth2/authorize?` +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'users.read tweet.read tweet.write offline.access',
      state: 'random-state-string', // Replace with a secure random string in production
      code_challenge: 'challenge', // For PKCE, implement a proper code challenge
      code_challenge_method: 'plain'
    });

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    },
    body: ''
  };
};