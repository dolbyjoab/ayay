const axios = require('axios');

exports.handler = async function (event, context) {
  const { user, quote } = JSON.parse(event.body);
  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = 'dolbyjoab';
  const repoName = 'ayay';

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
      {
        title: `Quote submission by ${user.name}`,
        body: quote,
        labels: ['pending']
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Quote submitted successfully' })
    };
  } catch (error) {
    console.error('Submit quote error:', error.message, error.response?.data);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};