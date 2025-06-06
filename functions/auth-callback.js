const axios = require('axios');
const querystring = require('querystring');

exports.handler = async function (event, context) {
  const { code, state } = event.queryStringParameters;

  // Verify state to prevent CSRF attacks
  if (state !== 'random-state-string') { // Replace with a secure random string in production
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid state parameter' })
    };
  }

  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const redirectUri = `https://${event.headers.host}/.netlify/functions/auth-callback`;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: 'challenge' // For PKCE; use a proper verifier in production
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Fetch user data from Twitter API
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const user = {
      id: userResponse.data.data.id,
      username: userResponse.data.data.username,
      name: userResponse.data.data.name
    };

    // Return user data and token to the client
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: access_token,
        refreshToken: refresh_token,
        user
      })
    };
  } catch (error) {
    console.error('Auth callback error:', error.message, error.response?.data);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: 'Failed to authenticate with Twitter' })
    };
  }
};