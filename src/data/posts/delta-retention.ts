import type { BlogPost } from '../blog';

const post: BlogPost = {
  slug: 'delta-time-travel-retention',
  title: 'Delta Time Travel: Data Retention — The Part People Miss',
  date: '2026-03-20',
  description:
    'The silent trap in Delta Lake time travel: why DESCRIBE HISTORY shows versions you cannot actually query, and how to configure retention so your history is always there when you need it.',
  tags: ['Databricks', 'Delta Lake', 'Data Engineering', 'SQL'],
  readTime: '4 min read',
  content: `# Delta Time Travel: Data Retention — The Part People Miss

Time travel needs two things to work: the **transaction log entry** for a version, and the **Parquet data files** that version points to. These are controlled by two separate table properties — and their defaults create a silent trap.

---

## The Two-Layer System

\`\`\`text
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

## A Concrete Example: the \`orders\` Table

Imagine this table was created on Feb 18 and today is **March 20**. Here is its full history from \`DESCRIBE HISTORY orders\`:

\`\`\`text
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

## Scenario A — Default Settings (the Silent Trap)

\`\`\`text
delta.logRetentionDuration         = interval 30 days  ← default
delta.deletedFileRetentionDuration = interval 7 days   ← default
\`\`\`

Picture a timeline. Today is March 20. VACUUM runs nightly.

\`\`\`text
Feb 18   Feb 25   Mar 1    Mar 5    Mar 10   Mar 15   Mar 20
  v0       v1       v2      v3 v4     v5       v6       v7
  │        │        │        │  │     │        │        │
  ●────────●────────●────────●──●─────●────────●────────●
                                                         ▲
                                                       TODAY

  Log window (30 days back → Feb 19):
           ◄─────────────────────────────────────────────
           v1–v7 visible in DESCRIBE HISTORY ✓
           (v0 outside window — not shown)

  File window (7 days back → Mar 13):
                                          ◄──────────────
                                          Only files from
                                          Mar 13–Mar 20 still
                                          exist on storage
\`\`\`

Result for each version **today**:

\`\`\`text
version  date      log entry?  data files?  time travel?
───────  ────────  ──────────  ───────────  ────────────
v7       Mar 20    ✅ present   ✅ present   ✅ WORKS
v6       Mar 15    ✅ present   ✅ present   ✅ WORKS
v5       Mar 10    ✅ present   ❌ deleted   💥 FileNotFoundException
v4       Mar 05    ✅ present   ❌ deleted   💥 FileNotFoundException
v3       Mar 05    ✅ present   ❌ deleted   💥 FileNotFoundException
v2       Mar 01    ✅ present   ❌ deleted   💥 FileNotFoundException
v1       Feb 25    ✅ present   ❌ deleted   💥 FileNotFoundException
v0       Feb 18    ❌ not shown  ❌ deleted   💥 not in DESCRIBE HISTORY
\`\`\`

The log confidently shows v1 through v5. You run \`SELECT * FROM orders VERSION AS OF 3\` to recover the bad price data — and it blows up. The log is a lie: it remembers the version but the actual rows are gone.

This is the trap: **default log retention (30 days) is far longer than default file retention (7 days)**, creating a window where history looks queryable but isn't.

---

## Scenario B — Settings Aligned to 30 Days (Correct)

\`\`\`text
delta.logRetentionDuration         = interval 30 days
delta.deletedFileRetentionDuration = interval 30 days  ← raised to match
\`\`\`

\`\`\`text
Feb 18   Feb 25   Mar 1    Mar 5    Mar 10   Mar 15   Mar 20
  v0       v1       v2      v3 v4     v5       v6       v7
  │        │        │        │  │     │        │        │
  ●────────●────────●────────●──●─────●────────●────────●
                                                         ▲
                                                       TODAY

  Log window (30 days → Feb 19):
           ◄─────────────────────────────────────────────
           v1–v7 visible ✓  (v0 just outside window)

  File window (30 days → Feb 19):
           ◄─────────────────────────────────────────────
           Files for all those versions still on storage ✓
\`\`\`

Result:

\`\`\`text
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

## Scenario C — Full History (60 Days)

If you want all versions visible and queryable for a longer period, set both properties to cover that window.

\`\`\`text
delta.logRetentionDuration         = interval 60 days
delta.deletedFileRetentionDuration = interval 60 days
\`\`\`

\`\`\`text
Feb 18   Feb 25   Mar 1    Mar 5    Mar 10   Mar 15   Mar 20
  v0       v1       v2      v3 v4     v5       v6       v7
  │        │        │        │  │     │        │        │
  ●────────●────────●────────●──●─────●────────●────────●
                                                         ▲
                                                       TODAY

  Log window (60 days → Jan 19):
  ◄────────────────────────────────────────────────────────
  All versions v0–v7 visible ✓

  File window (60 days → Jan 19):
  ◄────────────────────────────────────────────────────────
  Files for all versions still on storage ✓
\`\`\`

Result:

\`\`\`text
version  date      log entry?  data files?  time travel?
───────  ────────  ──────────  ───────────  ────────────
v7       Mar 20    ✅ present   ✅ present   ✅ WORKS
v6       Mar 15    ✅ present   ✅ present   ✅ WORKS
v5       Mar 10    ✅ present   ✅ present   ✅ WORKS
v4       Mar 05    ✅ present   ✅ present   ✅ WORKS
v3       Mar 05    ✅ present   ✅ present   ✅ WORKS
v2       Mar 01    ✅ present   ✅ present   ✅ WORKS
v1       Feb 25    ✅ present   ✅ present   ✅ WORKS
v0       Feb 18    ✅ present   ✅ present   ✅ WORKS
\`\`\`

The rule is simple: **set both properties to the longest window you ever need to query**. The cost is storage — deleted Parquet files are kept longer before VACUUM removes them. Only extend retention on tables where the audit or recovery window genuinely requires it.

---

## Setting the Properties

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

**Rule of thumb:** never run VACUUM with a threshold shorter than your \`deletedFileRetentionDuration\` table property.`,
};

export default post;
