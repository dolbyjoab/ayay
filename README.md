# Quote Website

A static website hosted on Netlify, allowing users to submit quotes via a Twitter (X) login, store them as GitHub issues, approve them, and display approved quotes on the site.

## Overview

This project creates a quote submission and approval system with the following components:

- **Website Hosting**: Netlify hosts the static site from a GitHub repository.
- **User Authentication**: Twitter (X) login via Netlify Identity and OAuth 2.0.
- **Quote Submission**: Users submit quotes through a form, creating GitHub issues via the GitHub API.
- **Approval Process**: Quotes are approved by labeling or closing GitHub issues, triggering a GitHub Action to update the site.
- **Quote Display**: Approved quotes are fetched from GitHub and displayed on the website.

## Prerequisites

- Basic knowledge of Git, GitHub, and web development (HTML, CSS, JavaScript).
- Accounts for:
  - GitHub (for repository and API access).
  - Netlify (for hosting and Identity).
  - X Developer Portal (for Twitter OAuth).

## Setup Instructions

### Step 1: Set Up the GitHub Repository

1. **Create a Repository**:
   - Sign in to [GitHub](https://github.com).
   - Click the “+” icon > “New repository.”
   - Name it (e.g., `quote-website`), set to public, initialize with a README, and create.

2. **Clone and Structure**:
   ```bash
   git clone https://github.com/your-username/quote-website.git
   cd quote-website