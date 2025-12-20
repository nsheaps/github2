import { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (token: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [token, setToken] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onLogin(token.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <svg height="48" width="48" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <h1>GitHub Rate Limit Viewer</h1>
        </div>

        <p className="login-description">
          Monitor your GitHub API rate limits in real-time with interactive charts.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="token">Personal Access Token</label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="token-input"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <button
          className="instructions-toggle"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? '▼' : '▶'} How to get a token?
        </button>

        {showInstructions && (
          <div className="instructions">
            <h3>Creating a Personal Access Token</h3>
            <ol>
              <li>
                Go to{' '}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Token Settings
                </a>
              </li>
              <li>Click "Generate new token (classic)"</li>
              <li>Give it a descriptive name (e.g., "Rate Limit Viewer")</li>
              <li>
                No scopes are required for public rate limit viewing, but you can select{' '}
                <code>read:user</code> for authenticated limits
              </li>
              <li>Click "Generate token"</li>
              <li>Copy the token and paste it above</li>
            </ol>
            <p className="warning">
              ⚠️ Never share your token! It's stored locally in your browser.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
