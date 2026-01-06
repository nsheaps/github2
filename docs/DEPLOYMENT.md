# Deployment Guide

This guide covers deploying GitHub2 to GitHub Pages.

## Prerequisites

- GitHub account
- Repository with the application code
- Write access to the repository

## GitHub Pages Setup

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (under "Code and automation")
4. Under **Source**, select **GitHub Actions**

### Step 2: Configure Repository Permissions

The deployment workflow requires specific permissions:

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, ensure:
   - ✅ Read and write permissions is selected
   - ✅ Allow GitHub Actions to create and approve pull requests (optional)

### Step 3: Trigger Deployment

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 4: Monitor Deployment

1. Go to **Actions** tab in your repository
2. Click on the latest "Deploy to GitHub Pages" workflow run
3. Wait for both **Build** and **Deploy** jobs to complete
4. Once successful, your site will be live at:

   ```text
   https://<username>.github.io/<repository-name>/
   ```

## Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the branch (main) and click **Run workflow**

## Configuration

### Base URL

The application is configured for GitHub Pages in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/github2/',
  // ... other config
});
```

**Important:** Update the `base` value to match your repository name if different.

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain:

   ```text
   example.com
   ```

2. Configure DNS:
   - For apex domain (example.com):
     - Create A records pointing to GitHub Pages IPs
   - For subdomain (`www.example.com`):
     - Create CNAME record pointing to `<username>.github.io`

3. Update repository settings:
   - Go to **Settings** → **Pages**
   - Enter your custom domain
   - Wait for DNS verification

See [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Workflow Files

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request:

- Lints code (ESLint, Prettier, Markdownlint, YAML)
- Runs tests
- Builds application
- Uploads build artifacts

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on pushes to `main`:

- Builds the application
- Deploys to GitHub Pages
- Sets up custom domain if configured

## Troubleshooting

### Build Fails

**Problem:** Build fails with TypeScript errors

**Solution:**

```bash
# Check locally first
npm run build

# Fix type errors
npm run lint:eslint
```

### Deployment Fails

**Problem:** Deploy step fails with permission error

**Solution:**

1. Check workflow permissions (Settings → Actions → General)
2. Ensure GitHub Pages source is set to "GitHub Actions"

### 404 on Deployed Site

**Problem:** Site returns 404 error

**Solution:**

1. Verify `base` in `vite.config.ts` matches repository name
2. Wait a few minutes for DNS propagation
3. Clear browser cache

### Assets Not Loading

**Problem:** JavaScript/CSS files return 404

**Solution:**

1. Check that `base` URL in `vite.config.ts` is correct
2. Ensure build completed successfully
3. Verify all paths in code use relative imports

## Environment Variables

For production deployment, you may want to configure:

```bash
# Create .env file (not committed)
VITE_GITHUB_CLIENT_ID=your_oauth_client_id
```

**Note:** Environment variables in GitHub Actions can be set via:

- Repository secrets (Settings → Secrets → Actions)
- Environment variables in workflow files

## Monitoring

After deployment, monitor:

1. **GitHub Actions:** Check workflow runs for errors
2. **GitHub Pages Status:** Settings → Pages shows deployment status
3. **Browser Console:** Check for runtime errors in deployed app

## Updating

To update the deployed application:

1. Make changes locally
2. Test thoroughly (`npm run dev`, `npm test`, `npm run build`)
3. Commit and push to `main`
4. Workflow automatically deploys changes

## Rollback

If you need to rollback a deployment:

1. Go to **Actions** tab
2. Find the last successful deployment
3. Click **Re-run all jobs**

Alternatively, revert the commit:

```bash
git revert <commit-hash>
git push origin main
```

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Reference Article](https://xebia.com/blog/deploy-an-astro-site-to-github-pages-using-github-actions/)
