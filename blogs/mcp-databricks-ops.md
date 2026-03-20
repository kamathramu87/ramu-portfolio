# How to Set Up a Local MCP Agent for Databricks Ops in VS Code

As a data engineer, a big chunk of your day isn't writing pipelines. It's the small stuff.

*Did last night's job run succeed? Which task failed? Was it a real failure or just the cluster being flaky again?*

These questions take 30 seconds to ask and 10 minutes to answer by clicking through the Databricks UI. In this post I'll show you how to set up a local MCP server that gives VS Code Copilot direct access to your Databricks workspace — so you can ask those questions in plain English and get answers instantly.

---

## What is MCP?

Model Context Protocol (MCP) is an open standard from Anthropic. You write a small server that exposes functions as tools. Any MCP-compatible client — VS Code Copilot, Claude — discovers those tools and calls them during a conversation. The AI decides which tool to use and when, based on what you ask.

You don't build an agent. You just build the tools. Copilot is already the agent.

```
VS Code Copilot Agent
        │
        ▼
 Local MCP Server
        │
        ▼
Databricks CLI / APIs
        │
        ▼
Databricks Workspace
```

---

## Prerequisites

- Python 3.11+
- uv — `brew install uv`
- Databricks CLI — `brew install databricks`
- VS Code 1.99+ with GitHub Copilot extension

---

## Step 1 — Clone and Install

```bash
git clone https://github.com/kamathramu87/databricks-mcp-server
cd databricks-mcp-server
uv sync
```

## Step 2 — Authenticate with Databricks

Skip the Personal Access Token. Use OAuth — one login, no secrets in files:

```bash
databricks auth login --host https://adb-xxx.azuredatabricks.net
```

This opens a browser, authenticates you, and stores the token in `~/.databrickscfg`. The SDK picks it up automatically on every call.

## Step 3 — Set Your Workspace URL

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABRICKS_HOST=https://adb-xxx.azuredatabricks.net
```

That's the only thing you need in there.

## Step 4 — Open the Folder in VS Code

```bash
code .
```

The project includes `.vscode/mcp.json` which VS Code auto-discovers:

```json
{
  "servers": {
    "databricks": {
      "type": "stdio",
      "command": "uv",
      "args": ["--directory", "${workspaceFolder}", "run", "databricks-mcp"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

And `.vscode/settings.json` which enables MCP in Copilot:

```json
{
  "chat.mcp.access": "all"
}
```

## Step 5 — Start the MCP Server

`Cmd+Shift+P` → **MCP: List Servers** → click **Start** next to `databricks`.

You should see it go green. If it errors, check the Output panel — most common issue is `uv` not being on PATH, which you can fix by replacing `"command": "uv"` in `mcp.json` with the full path from `which uv`.

## Step 6 — Use It in Copilot Chat

Open Copilot Chat, switch to **Agent** mode, and start asking:

```
Which jobs have a failed latest run?
```
```
What failed in the last run of the "daily_sales_load" job and why?
```
```
Show me the last 5 runs of job 12345
```

Copilot calls the right tools in sequence, reads the results, and gives you a plain-English answer — no UI clicking required.

---

## The Real Power: Multi-Step Tasks

The tools are simple building blocks. The AI chains them together based on what you ask — this is where it becomes more than a script.

A good example is bootstrap error detection. Paste this into Copilot Chat:

```
Scan all Databricks jobs for bootstrap failures:

1. Call list_jobs to get every job
2. For each job call list_job_runs with limit=1 to get the latest run
3. For any FAILED run, call get_job_run to read the full error
4. Decide if it's a bootstrap error — cluster init failures, Spark context errors,
   driver startup failures before job logic ran
5. For confirmed bootstrap failures, call run_job to rerun
6. Show a summary: jobs checked / failed / rerun / skipped with reason
```

Copilot works through every job, reads the actual error messages, judges whether each failure is truly a bootstrap error, reruns only those, and explains every decision. A 20-minute Monday morning task in one paste.

This is the difference from a script: a script answers one fixed question. Copilot with MCP tools can adapt to what it finds, reason about ambiguous errors, and explain what it did — because it's not executing a recipe, it's thinking through the problem.

---

## Code

Full source: [kamathramu87/databricks-mcp-server](https://github.com/kamathramu87/databricks-mcp-server)

Setup is about 10 minutes. The server itself is one Python file.
