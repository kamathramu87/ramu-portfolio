import type { BlogPost } from '../blog';

const post: BlogPost = {
  slug: 'delta-time-travel-explained',
  title: 'Delta Time Travel Explained: Query the Past, Restore the Present',
  date: '2026-03-20',
  description:
    'A clear, practical guide to Delta Lake time travel — what it is, how VERSION AS OF and TIMESTAMP AS OF differ, when to use each, and how to configure retention so you never lose access to the history you need.',
  tags: ['Databricks', 'Delta Lake', 'Data Engineering', 'Python', 'SQL'],
  readTime: '6 min read',
  content: `# Delta Time Travel Explained: Query the Past, Restore the Present

Every Delta table keeps a transaction log — a running record of every write, delete, merge, and schema change that has ever happened to it. Delta time travel is the ability to query any previous version of that table using either a **version number** or a **timestamp**.

That sounds simple. But once you understand exactly what each approach gives you — and what happens to your data under VACUUM — the feature becomes genuinely powerful for debugging, auditing, and safe data recovery.

---

## The Core Idea: Every Write Creates a New Version

When you write to a Delta table, Databricks does not overwrite files in place. It adds new Parquet files and records the operation in \`_delta_log/\`. That log entry gets a version number, starting at 0.

\`\`\`
Version 0 → CREATE TABLE
Version 1 → INSERT (batch A)
Version 2 → INSERT (batch B)
Version 3 → DELETE WHERE id = 42
Version 4 → MERGE ...
\`\`\`

At any point you can go back and read the table *as it looked* at version 1 — before the delete, before the merge. The old Parquet files are still on storage (until VACUUM removes them). Delta just reconstructs the correct snapshot from the log.

---

## Viewing Table History

Before you time travel, check what versions exist:

\`\`\`sql
DESCRIBE HISTORY my_catalog.my_schema.orders;
\`\`\`

\`\`\`python
from delta.tables import DeltaTable
dt = DeltaTable.forName(spark, "my_catalog.my_schema.orders")
dt.history().show(truncate=False)
\`\`\`

The output shows each version with its timestamp, operation (\`WRITE\`, \`DELETE\`, \`MERGE\`, \`OPTIMIZE\`, etc.), and the user who ran it. This alone is useful as an audit log even if you never query an old version.

---

## VERSION AS OF vs TIMESTAMP AS OF

These are the two ways to access historical data, and they answer different questions.

### VERSION AS OF — exact and deterministic

\`\`\`sql
-- SQL
SELECT * FROM orders VERSION AS OF 3;

-- PySpark
df = spark.read.format("delta").option("versionAsOf", 3).load("/path/to/orders")
\`\`\`

Use this when you know the exact version — for example, you ran \`DESCRIBE HISTORY\` and found that version 3 was the last clean state before a bad merge. The result is 100% reproducible: the same version always returns the same data.

### TIMESTAMP AS OF — human-readable, but needs care

\`\`\`sql
-- SQL
SELECT * FROM orders TIMESTAMP AS OF '2026-03-18T09:00:00';

-- PySpark
df = spark.read.format("delta") \\
    .option("timestampAsOf", "2026-03-18T09:00:00") \\
    .load("/path/to/orders")
\`\`\`

Databricks finds the **latest version whose commit timestamp is ≤ the timestamp you provide**. If you ask for 09:00 and the nearest version was committed at 08:47, you get that one.

This is useful when you think in calendar time ("what did this table look like yesterday morning?") but the result depends on when writes actually landed, not the timestamp you typed.

### The key difference

| | VERSION AS OF | TIMESTAMP AS OF |
|---|---|---|
| Input | Integer (e.g. \`3\`) | Timestamp string |
| Determinism | Exact — always same result | Approximate — finds nearest version ≤ timestamp |
| Best for | "Give me version N" | "Give me the state around time T" |
| Gotcha | Need to know the version number | Clock skew or sparse writes can surprise you |

---

## Practical Use Cases

### 1. Auditing — what changed between two versions?

\`\`\`sql
-- Rows in version 5 that are not in version 3
SELECT * FROM orders VERSION AS OF 5
EXCEPT
SELECT * FROM orders VERSION AS OF 3;
\`\`\`

### 2. Debugging a bad write — inspect before and after

\`\`\`python
before = spark.read.format("delta").option("versionAsOf", 4).load(path)
after  = spark.read.format("delta").option("versionAsOf", 5).load(path)

before.createOrReplaceTempView("v4")
after.createOrReplaceTempView("v5")

spark.sql("""
  SELECT v5.id, v4.amount AS before, v5.amount AS after
  FROM v5
  JOIN v4 ON v5.id = v4.id
  WHERE v4.amount != v5.amount
""").show()
\`\`\`

### 3. Restoring a table to a previous version

\`\`\`sql
-- Restore the entire table to how it looked at version 3
RESTORE TABLE orders TO VERSION AS OF 3;

-- Or by timestamp
RESTORE TABLE orders TO TIMESTAMP AS OF '2026-03-18T09:00:00';
\`\`\`

\`RESTORE\` writes a new version (so it is auditable) and does not delete data — it is safe to run.

---

## Data Retention: The Part People Miss

Time travel needs two things to work: the **transaction log entry** for a version, and the **Parquet data files** that version points to. These are controlled by two separate table properties — and their defaults create a silent trap.

### The two-layer system

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 1 — TRANSACTION LOG  (_delta_log/*.json)                  │
│                                                                  │
│  What it holds:  version numbers, timestamps, operation type,    │
│                  user, file paths added/removed per version      │
│                                                                  │
│  Retention:      delta.logRetentionDuration  (default 30 days)  │
│                                                                  │
│  When it expires: DESCRIBE HISTORY stops showing the entry.      │
│                   Version-based time travel returns an error.    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  LAYER 2 — DATA FILES  (part-xxxx.snappy.parquet)               │
│                                                                  │
│  What it holds:  the actual rows for each historical snapshot    │
│                                                                  │
│  Retention:      delta.deletedFileRetentionDuration              │
│                  (default 7 days)                                │
│                                                                  │
│  When it expires: VACUUM physically deletes the Parquet files.   │
│                   Time travel errors with FileNotFoundException. │
└──────────────────────────────────────────────────────────────────┘

Time travel requires BOTH layers to be present for a given version.
\`\`\`

---

### A concrete example: the \`orders\` table

Imagine this table was created on Feb 18 and today is **March 20**. Here is its full history from \`DESCRIBE HISTORY orders\`:

\`\`\`
version  timestamp            operation  description
───────  ───────────────────  ─────────  ──────────────────────────────────
7        2026-03-20 08:00     WRITE      Daily batch load — 2,000 new rows
6        2026-03-15 02:00     OPTIMIZE   Compaction run (scheduled)
5        2026-03-10 09:30     DELETE     Purged cancelled orders
4        2026-03-05 11:45     MERGE      Corrected wrong prices from v3
3        2026-03-05 11:30     WRITE      ← BAD: accidental 10% price hike
2        2026-03-01 08:00     WRITE      Batch load — 5,000 rows
1        2026-02-25 08:00     WRITE      Initial load — 10,000 rows
0        2026-02-18 14:00     CREATE     Table created
\`\`\`

The log shows 8 versions across 30 days. Now let's see what you can actually query.

---

### Scenario A — Default settings (the silent trap)

\`\`\`
delta.logRetentionDuration         = interval 30 days  ← default
delta.deletedFileRetentionDuration = interval 7 days   ← default
\`\`\`

Picture a timeline. Today is March 20. VACUUM runs nightly.

\`\`\`
Feb 18   Feb 25   Mar 1    Mar 5    Mar 10   Mar 15   Mar 20
  v0       v1       v2      v3 v4     v5       v6       v7
  │        │        │        │  │     │        │        │
  ●────────●────────●────────●──●─────●────────●────────●
                                                         ▲
                                                       TODAY

  Log window (30 days back → Feb 19):
  ◄────────────────────────────────────────────────────────
  All 8 versions visible in DESCRIBE HISTORY ✓

  File window (7 days back → Mar 13):
                                          ◄────────────────
                                          Only files from
                                          Mar 13–Mar 20 still
                                          exist on storage
\`\`\`

Result for each version **today**:

\`\`\`
version  date      log entry?  data files?  time travel?
───────  ────────  ──────────  ───────────  ────────────
v7       Mar 20    ✅ present   ✅ present   ✅ WORKS
v6       Mar 15    ✅ present   ✅ present   ✅ WORKS
v5       Mar 10    ✅ present   ❌ deleted   💥 FileNotFoundException
v4       Mar 05    ✅ present   ❌ deleted   💥 FileNotFoundException
v3       Mar 05    ✅ present   ❌ deleted   💥 FileNotFoundException
v2       Mar 01    ✅ present   ❌ deleted   💥 FileNotFoundException
v1       Feb 25    ✅ present   ❌ deleted   💥 FileNotFoundException
v0       Feb 18    ❌ expired   ❌ deleted   💥 version not found
\`\`\`

The log confidently shows v1 through v5. You run \`SELECT * FROM orders VERSION AS OF 3\` to recover the bad price data — and it blows up. The log is a lie: it remembers the version but the actual rows are gone.

This is the trap: **default log retention (30 days) is far longer than default file retention (7 days)**, creating a window where history looks queryable but isn't.

---

### Scenario B — Settings aligned to 30 days (correct)

\`\`\`
delta.logRetentionDuration         = interval 30 days
delta.deletedFileRetentionDuration = interval 30 days  ← raised to match
\`\`\`

\`\`\`
Feb 18   Feb 25   Mar 1    Mar 5    Mar 10   Mar 15   Mar 20
  v0       v1       v2      v3 v4     v5       v6       v7
  │        │        │        │  │     │        │        │
  ●────────●────────●────────●──●─────●────────●────────●
                                                         ▲
                                                       TODAY

  Log window (30 days → Feb 19):
  ◄────────────────────────────────────────────────────────
  Versions v1–v7 visible ✓  (v0 just outside window)

  File window (30 days → Feb 19):
  ◄────────────────────────────────────────────────────────
  Files for all those versions still on storage ✓
\`\`\`

Result:

\`\`\`
version  date      log entry?  data files?  time travel?
───────  ────────  ──────────  ───────────  ────────────
v7       Mar 20    ✅ present   ✅ present   ✅ WORKS
v6       Mar 15    ✅ present   ✅ present   ✅ WORKS
v5       Mar 10    ✅ present   ✅ present   ✅ WORKS
v4       Mar 05    ✅ present   ✅ present   ✅ WORKS
v3       Mar 05    ✅ present   ✅ present   ✅ WORKS  ← can see bad data
v2       Mar 01    ✅ present   ✅ present   ✅ WORKS
v1       Feb 25    ✅ present   ✅ present   ✅ WORKS
v0       Feb 18    ❌ expired   ❌ expired   ❌ outside window
\`\`\`

Now \`SELECT * FROM orders VERSION AS OF 3\` returns the rows with the bad prices — exactly what you need to understand what went wrong and to write a corrective MERGE.

---

### Setting the properties

\`\`\`sql
-- On an existing table
ALTER TABLE orders
SET TBLPROPERTIES (
  'delta.logRetentionDuration'         = 'interval 30 days',
  'delta.deletedFileRetentionDuration' = 'interval 30 days'
);
\`\`\`

\`\`\`sql
-- At creation time
CREATE TABLE orders (
  id     BIGINT,
  amount DECIMAL(10,2),
  status STRING
)
USING DELTA
TBLPROPERTIES (
  'delta.logRetentionDuration'         = 'interval 30 days',
  'delta.deletedFileRetentionDuration' = 'interval 30 days'
);
\`\`\`

> **Runtime note:** On Databricks Runtime 18.0+ (and Unity Catalog managed tables from Runtime 12.2+), \`logRetentionDuration\` must be ≥ \`deletedFileRetentionDuration\`. Setting file retention higher than log retention is blocked — you can't keep files for longer than the log tracks them.

> **Cost note:** Raising \`deletedFileRetentionDuration\` keeps more Parquet files on storage. For a high-churn table this adds up. Only extend retention on tables where the audit or recovery window genuinely requires it.

---

## VACUUM and the Retention Threshold

VACUUM is the command that physically deletes files older than \`deletedFileRetentionDuration\`:

\`\`\`sql
VACUUM orders;                    -- uses the table property threshold
VACUUM orders RETAIN 168 HOURS;  -- override: keep 7 days
\`\`\`

By default Databricks blocks \`VACUUM\` with a threshold below 7 days as a safety measure. You can override it, but shortening the window means time travel into that period will fail with a \`FileNotFoundException\` — the log says the version existed but the files are gone.

**Rule of thumb:** never run VACUUM with a threshold shorter than your \`deletedFileRetentionDuration\` table property.

---

## Quick Reference

\`\`\`sql
-- View history
DESCRIBE HISTORY my_table;

-- Query by version
SELECT * FROM my_table VERSION AS OF 5;

-- Query by timestamp
SELECT * FROM my_table TIMESTAMP AS OF '2026-03-01';

-- Restore (creates a new version, auditable)
RESTORE TABLE my_table TO VERSION AS OF 5;

-- Set retention
ALTER TABLE my_table SET TBLPROPERTIES (
  'delta.logRetentionDuration'         = 'interval 30 days',
  'delta.deletedFileRetentionDuration' = 'interval 30 days'
);

-- VACUUM (respects table property by default)
VACUUM my_table;
\`\`\`

---

## Summary

- Every Delta write creates an immutable version — time travel reads any of them.
- **VERSION AS OF** is exact and deterministic; **TIMESTAMP AS OF** finds the nearest commit ≤ your timestamp.
- The history log (\`logRetentionDuration\`) and the data files (\`deletedFileRetentionDuration\`) have separate retention controls — both need to cover your required window.
- VACUUM enforces the data file threshold; files deleted by VACUUM cannot be time-travelled to.
- \`RESTORE\` is the safe, auditable way to roll back a table — it adds a new version rather than rewriting history.

Official reference: [Delta table history — Azure Databricks](https://learn.microsoft.com/en-us/azure/databricks/delta/history)`,
};

export default post;
