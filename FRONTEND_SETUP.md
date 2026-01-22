# Frontend Setup - Fixing npm Permission Issues

## Problem
The frontend can't run because `thirdweb` package isn't installed due to npm cache permission errors.

## Solution

### Option 1: Fix npm Cache Permissions (Recommended)

Run these commands in order:

```bash
# Fix npm cache ownership
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force

# Navigate to project
cd /Users/arrnaya/Documents/GitHub/BCarbon-base44/BiCO2

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Option 2: Use Different Package Manager (Faster Alternative)

If Option 1 doesn't work, use `yarn` or `pnpm` instead:

**Using Yarn:**
```bash
# Install yarn globally (if not installed)
npm install -g yarn

# Navigate to project
cd /Users/arrnaya/Documents/GitHub/BCarbon-base44/BiCO2

# Install dependencies
yarn install

# Start dev server
yarn dev
```

**Using pnpm:**
```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Navigate to project
cd /Users/arrnaya/Documents/GitHub/BCarbon-base44/BiCO2

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### Option 3: Manual thirdweb Installation

If you just want to get it working quickly:

```bash
cd /Users/arrnaya/Documents/GitHub/BCarbon-base44/BiCO2

# Install just thirdweb
npm install thirdweb --legacy-peer-deps

# Start dev server
npm run dev
```

## Verification

After installation, verify thirdweb is installed:

```bash
ls node_modules | grep thirdweb
# Should show: thirdweb

npm list thirdweb
# Should show: thirdweb@5.105.18
```

## What's Working

✅ **Backend (all running in Docker)**:
- PostgreSQL database
- Event indexer service  
- API server on port 4090

Test backend:
```bash
curl http://localhost:4090/health
curl http://localhost:4090/api/v2/projects
```

## Next Steps

Once frontend dependencies are installed:

1. Frontend will start on http://localhost:3001
2. Projects page will use new cached API
3. Data will load instantly from database

## Still Having Issues?

If none of the above work, you can:

1. **Delete node_modules and try again**:
```bash
cd /Users/arrnaya/Documents/GitHub/BCarbon-base44/BiCO2
rm -rf node_modules package-lock.json
npm install
```

2. **Use Docker for frontend too** (if you prefer):
```bash
# We can create a Dockerfile for the frontend as well
```

3. **Check npm version**:
```bash
npm --version
# Should be 8.x or higher
# If not: npm install -g npm@latest
```
