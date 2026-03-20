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

Time travel only works if the underlying data files still exist on storage. Two table properties control this.

### delta.logRetentionDuration

Controls how long the **transaction log** (the history) is kept.

- Default: **30 days**
- Governs how far back \`DESCRIBE HISTORY\` shows and how far back version-based time travel can reach.

### delta.deletedFileRetentionDuration

Controls how long **data files** that are no longer part of the current version are kept before VACUUM is allowed to delete them.

- Default: **7 days**
- This is what actually limits your time travel window for data.

### Why both matter

The log might say "version 10 exists from 25 days ago" but if VACUUM ran with the default 7-day threshold, the Parquet files for version 10 were deleted 18 days ago. The log entry is there — the data is not.

**To get 30 days of usable time travel**, set both to match:

\`\`\`sql
ALTER TABLE orders
SET TBLPROPERTIES (
  'delta.logRetentionDuration'         = 'interval 30 days',
  'delta.deletedFileRetentionDuration' = 'interval 30 days'
);
\`\`\`

Or set them at table creation:

\`\`\`sql
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

> **Note:** On Databricks Runtime 18.0+, \`logRetentionDuration\` must be ≥ \`deletedFileRetentionDuration\`. For Unity Catalog managed tables this applies from Runtime 12.2+. Setting retention higher keeps more history but increases storage costs — only do it for tables where the audit or recovery window genuinely requires it.

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
