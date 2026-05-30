# Cadence - deploy to Vercel with working AI features

This folder is ready to push to GitHub and deploy on Vercel. Once deployed,
anyone who opens your URL can use the AI features (natural-language capture,
prioritize, plan my day). Their browser talks to a small serverless function
on your domain, which holds your Anthropic key and forwards the request. The
key stays on the server, never in the browser, never in your code.

## What's in here

```
.
├── index.html        the app (a single self-contained file)
├── api/
│   └── claude.js      serverless proxy that adds your key and calls Anthropic
├── package.json       marks the project as an ES module
└── README.md          this file
```

## How it works

- The app calls `/api/claude` (same domain, so no CORS setup needed).
- `api/claude.js` runs on Vercel's servers, reads your key from an environment
  variable named `ANTHROPIC_API_KEY`, and forwards the request to Anthropic.
- If the AI is ever unreachable, the app falls back to its built-in local logic,
  so it never breaks.

## Steps

### 1. Get an Anthropic API key
- Go to https://console.anthropic.com
- Create a key under API Keys. Copy it (starts with `sk-ant-`).

### 2. Set a spending cap (recommended backstop)
Because every visitor's AI usage is billed to you, set a hard limit so the bill
can't surprise you:
- In the Anthropic Console, open Billing / Limits and set a monthly spend cap to
  an amount you're comfortable with.

### 3. Push this folder to GitHub
From inside this folder:

```bash
git init
git add .
git commit -m "Cadence task tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Or just drag-and-drop these files into a new repo on github.com.)

### 4. Deploy on Vercel
- Go to https://vercel.com and sign in with GitHub.
- Click "Add New… → Project", pick your repo, and click Import.
- Framework Preset: leave as "Other" (it's a static site + serverless function).
- Before clicking Deploy, open "Environment Variables" and add:
  - Name:  `ANTHROPIC_API_KEY`
  - Value: your `sk-ant-...` key
- Click Deploy.

That's it. Vercel gives you a URL like `https://your-project.vercel.app`.
Open it, add a task in plain language, hit Prioritize or Plan my day, and the
AI features work for anyone you share the link with.

### Updating later
Push to the `main` branch and Vercel redeploys automatically. To change the key,
edit the environment variable in Vercel → Settings → Environment Variables and
redeploy.

## A note on cost
Anyone with the link uses your key, and you pay for that usage. For a portfolio
demo shared with a few people this is typically very cheap. The spending cap in
step 2 is your safety net. If you later want to make it broadly public without
cost risk, the alternative is to have each visitor paste their own key, which is
a different setup. Ask if you want that version.

## Testing locally (optional)
Install the Vercel CLI and run the dev server, which runs the serverless
function too:

```bash
npm i -g vercel
vercel dev
```

Then open the local URL it prints. You'll need `ANTHROPIC_API_KEY` set in your
shell or a `.env` file for the AI features to work locally.
