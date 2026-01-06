# GitHub Actions Workflows

## Vercel Deploy Action

This workflow automatically triggers a Vercel deployment whenever code is merged into the `main` branch.

### Setup Instructions

1. **Get your Vercel Deploy Hook URL:**
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Git** → **Deploy Hooks**
   - Create a new deploy hook:
     - Name: `GitHub Actions Deploy`
     - Branch: `main` (or your production branch)
   - Copy the generated webhook URL

2. **Add the Deploy Hook to GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: Paste the Vercel Deploy Hook URL
   - Click **Add secret**

### How It Works

The workflow triggers on:
- Direct pushes to the `main` branch
- When a Pull Request is merged into `main`

When triggered, it:
1. Checks out the code
2. Calls the Vercel Deploy Hook URL
3. Verifies the deployment was triggered successfully

### Workflow File

See [vercel-deploy.yml](./vercel-deploy.yml) for the complete workflow configuration.

### Troubleshooting

**Error: VERCEL_DEPLOY_HOOK secret is not set**
- Make sure you've added the `VERCEL_DEPLOY_HOOK` secret to your repository settings

**Error: Failed to trigger deployment**
- Verify the Deploy Hook URL is correct
- Check that the hook is enabled in Vercel
- Ensure the hook is configured for the correct branch

### Manual Deployment

You can also manually trigger deployments from the Actions tab in GitHub by re-running the workflow.
