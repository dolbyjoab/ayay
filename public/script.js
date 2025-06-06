document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const loginStatus = document.getElementById('login-status');
  const quoteForm = document.getElementById('quote-form');
  const submitQuoteForm = document.getElementById('submit-quote');

  // Check for callback parameters
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code && state) {
    // Handle OAuth callback
    fetch(`/.netlify/functions/auth-callback?code=${code}&state=${state}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          loginStatus.innerText = `Error: ${data.error}`;
          return;
        }
        localStorage.setItem('twitterAccessToken', data.accessToken);
        localStorage.setItem('twitterUser', JSON.stringify(data.user));
        loginStatus.innerText = `Logged in as ${data.user.name}`;
        loginBtn.style.display = 'none';
        quoteForm.style.display = 'block';
        window.history.replaceState({}, document.title, '/'); // Clean URL
      })
      .catch(error => {
        loginStatus.innerText = `Error: ${error.message}`;
      });
  } else {
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('twitterUser'));
    if (user) {
      loginStatus.innerText = `Logged in as ${user.name}`;
      loginBtn.style.display = 'none';
      quoteForm.style.display = 'block';
    } else {
      loginStatus.innerText = 'Not logged in';
      loginBtn.style.display = 'block';
      quoteForm.style.display = 'none';
    }
  }

  // Initiate login
  loginBtn.addEventListener('click', () => {
    window.location.href = '/.netlify/functions/auth-login';
  });

  // Handle quote submission
  submitQuoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const quoteText = document.getElementById('quote-text').value;
    const user = JSON.parse(localStorage.getItem('twitterUser'));
    const accessToken = localStorage.getItem('twitterAccessToken');

    if (!user || !accessToken) {
      alert('Please log in to submit a quote.');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/submit-quote', {
        method: 'POST',
        body: JSON.stringify({ user, quote: quoteText })
      });
      const result = await response.json();
      alert(result.message);
      document.getElementById('quote-text').value = '';
    } catch (error) {
      alert('Error submitting quote: ' + error.message);
    }
  });

  // Load quotes
  async function loadQuotes() {
    const response = await fetch('/quotes.json');
    const quotes = await response.json();
    const quoteList = document.getElementById('quote-list');
    quoteList.innerHTML = '';
    quotes.forEach(quote => {
      const li = document.createElement('li');
      li.innerText = `"${quote.quote}" — ${quote.author}`;
      quoteList.appendChild(li);
    });
  }
  loadQuotes();
});