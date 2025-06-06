const fs = require('fs').promises;
const axios = require('axios');

async function fetchApprovedQuotes() {
  console.log('Starting fetchApprovedQuotes');
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN is not set');
  }
  const repoOwner = 'your-username'; // Replace with your GitHub username
  const repoName = 'quote-website'; // Replace with your repository name

  console.log(`Fetching issues from ${repoOwner}/${repoName}`);
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues?labels=approved`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    console.log('Issues fetched:', response.data);
    const quotes = response.data.map(issue => ({
      id: issue.id,
      quote: issue.body,
      author: issue.title.replace('Quote submission by ', '')
    }));

    console.log('Writing quotes to src/quotes.json:', quotes);
    await fs.writeFile('src/quotes.json', JSON.stringify(quotes, null, 2));
    console.log('Quotes written successfully');
  } catch (error) {
    console.error('Error fetching issues:', error.message, error.response?.data);
    throw error;
  }
}

fetchApprovedQuotes().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});