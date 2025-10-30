/**
 * Dynamic Data Transformation — Fully Commented Version
 * Node.js / JavaScript (works on Node 14+, tested on 18+)
 *
 * Goal:
 *  - Convert raw user action events into a per-user summary:
 *      actions[action] -> { count, lastPerformed }
 *      totalActions -> total count across actions for that user
 *  - Do NOT mutate input.
 *  - Use array methods (reduce/map/sort/filter).
 *  - Handle large data efficiently (O(n) time, O(U × A) space).
 *
 * Why so many comments?
 *  - Every line explains what it does and why we need it, so the intent is clear.
 */

/* =========================== Core Function =========================== */

/**
 * Build per-user action summary with counts and most recent time.
 * @param {Array} data  // the raw events array: { userId, name, action, timestamp }
 * @param {Object} options  // configuration flags to control behavior
 * @param {boolean} [options.caseSensitiveActions=false] // false: "Click" and "click" are the same; reduces accidental splits
 * @param {boolean} [options.sortUsersById=true]         // true: stable, predictable output order for snapshots/tests
 * @param {boolean} [options.sortActions=true]           // true: improves readability and deterministic diffs
 * @returns {Array}                                      // [{ userId, name, actions: {action: {count,lastPerformed}}, totalActions }]
 */
function generateUserReport(
    data,
    { caseSensitiveActions = false, sortUsersById = true, sortActions = true } = {}
) {
    // We copy the array to avoid mutating caller-owned memory; immutability prevents hidden side effects.
    const safe = Array.isArray(data) ? data.slice() : [];

    // We aggregate with Array.prototype.reduce to emphasize functional style and single-pass processing (O(n)).
    const userMap = safe.reduce((map, row) => {
        // Guard: if the row is null/undefined, skip to keep the function resilient to bad inputs.
        if (!row) return map;

        // Guard: userId is required to bucket events by user; without it we can’t attribute the action.
        if (row.userId === undefined || row.userId === null) return map;

        // Guard: action and timestamp are required to count and compute recency; otherwise the row adds no value.
        if (!row.action || !row.timestamp) return map;

        // Normalize the action key if case sensitivity is disabled.
        // Why: prevents "Click" vs "click" from becoming separate buckets due to data inconsistencies.
        const actKey = caseSensitiveActions ? String(row.action) : String(row.action).toLowerCase();

        // Parse the timestamp once to a millisecond value for cheap numeric comparisons.
        // Why: Date.parse gives NaN for invalid strings, letting us skip bad data safely.
        const t = Date.parse(row.timestamp);
        if (Number.isNaN(t)) return map; // Skip invalid timestamps to avoid poisoning the lastPerformed logic.

        // Initialize the user bucket if we haven't seen this userId yet.
        // Why: Map gives O(1) average lookup/insert and preserves insertion order for stable output if needed.
        if (!map.has(row.userId)) {
            map.set(row.userId, {
                userId: row.userId,                 // store the key for later serialization
                name: row.name ?? null,             // keep name; using ?? keeps null instead of undefined for consistency
                actions: Object.create(null),       // a null-prototype object avoids prototype keys interfering with action names
            });
        }

        // Pull the user record for updates.
        const u = map.get(row.userId);

        // Update name if a non-empty name is present.
        // Why: real systems sometimes fix display names later; keeping the last non-empty value reflects the newest truth.
        if (row.name) u.name = row.name;

        // Get the action bucket for this user; if missing, seed it with count=0 and no timestamp.
        // Why: we store per-action stats (count and lastPerformed) to satisfy the report requirements.
        const a = u.actions[actKey] || { count: 0, lastPerformed: null };

        // Increment the action count; this is the core metric for frequency.
        a.count += 1;

        // Update most recent occurrence if this event is newer.
        // Why: the spec needs the latest timestamp for each action ("lastPerformed").
        if (a.lastPerformed === null || t > Date.parse(a.lastPerformed)) {
            a.lastPerformed = new Date(t).toISOString(); // normalize to ISO for consistent, sortable output
        }

        // Persist the updated action bucket back to the user's actions table.
        u.actions[actKey] = a;

        // Return the accumulator to continue the reduce chain.
        return map;
    }, new Map());

    // Convert aggregated Map to the final array form expected by callers and tests.
    let result = Array.from(userMap.values()).map(u => {
        // Turn the actions object into sorted entries if configured.
        // Why: sorting makes outputs stable (important for tests and code reviews).
        const actionEntries = Object.entries(u.actions);
        const sortedEntries = sortActions ? actionEntries.sort(([a], [b]) => a.localeCompare(b)) : actionEntries;

        // Rebuild a plain object from entries so consumers can access actions by name in O(1).
        const actionsObj = sortedEntries.reduce((acc, [k, v]) => {
            // We clone just the shape we want to return, keeping the surface minimal and predictable.
            acc[k] = { count: v.count, lastPerformed: v.lastPerformed };
            return acc;
        }, {});

        // Compute the per-user total across all actions.
        // Why: the requirements now include totalActions to summarize overall activity.
        const totalActions = Object.values(actionsObj).reduce((s, x) => s + x.count, 0);

        // Return the finalized user summary record.
        return { userId: u.userId, name: u.name ?? null, actions: actionsObj, totalActions };
    });

    // Optional: sort users by numeric id for predictable ordering (useful for diffs and snapshots).
    if (sortUsersById) {
        result = result.sort((a, b) => {
            const an = Number(a.userId), bn = Number(b.userId);
            // If both are numbers, sort numerically; otherwise, fall back to lexicographic compare.
            if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
            return String(a.userId).localeCompare(String(b.userId));
        });
    }

    // Return the summary array; keeping it as an array makes it easy to serialize and stream.
    return result;
}

/* =========================== Test Helpers ============================ */

// deepSort: normalizes structure for deep equality by sorting keys/arrays.
// Why: stable comparisons are needed because object key order can differ across engines.
function deepSort(obj) {
    if (Array.isArray(obj)) {
        // Recursively sort each item, then sort array by JSON value for deterministic order.
        return obj.map(deepSort).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    } else if (obj && typeof obj === 'object') {
        // Sort object keys to avoid order-based diffs.
        const o = {};
        for (const k of Object.keys(obj).sort()) o[k] = deepSort(obj[k]);
        return o;
    }
    // Primitives return as-is.
    return obj;
}

// isDeepEqual: compares two values after deepSort normalization.
// Why: gives reliable PASS/FAIL even if key insertion order differs.
function isDeepEqual(a, b) {
    return JSON.stringify(deepSort(a)) === JSON.stringify(deepSort(b));
}

// assertEq: prints PASS/FAIL and diffs on mismatch.
// Why: a minimal test harness without external dependencies (no Jest/Mocha).
function assertEq(name, got, expected) {
    const ok = isDeepEqual(got, expected);
    console.log(`${name}: ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) {
        console.log('--- Expected ---\n' + JSON.stringify(expected, null, 2));
        console.log('---   Got    ---\n' + JSON.stringify(got, null, 2));
    }
    return ok;
}

/* =========================== Sample from Prompt ====================== */

// userData: the example dataset from the prompt.
// Why: anchors the behavior against a known, human-readable scenario.
const userData = [
    { userId: 1, name: 'Alice',   action: 'click',    timestamp: '2025-10-01T10:00:00Z' },
    { userId: 2, name: 'Bob',     action: 'scroll',   timestamp: '2025-10-01T10:05:00Z' },
    { userId: 1, name: 'Alice',   action: 'click',    timestamp: '2025-10-01T10:10:00Z' },
    { userId: 1, name: 'Alice',   action: 'navigate', timestamp: '2025-10-01T10:12:00Z' },
    { userId: 2, name: 'Bob',     action: 'click',    timestamp: '2025-10-01T10:15:00Z' },
    { userId: 3, name: 'Charlie', action: 'scroll',   timestamp: '2025-10-01T10:20:00Z' },
];

// expectedSample: exact output required by the updated requirement screenshots.
// Why: defines the contract (lastPerformed + totalActions).
const expectedSample = [
    {
        userId: 1,
        name: 'Alice',
        actions: {
            click:    { count: 2, lastPerformed: '2025-10-01T10:10:00.000Z' },
            navigate: { count: 1, lastPerformed: '2025-10-01T10:12:00.000Z' },
        },
        totalActions: 3
    },
    {
        userId: 2,
        name: 'Bob',
        actions: {
            click:  { count: 1, lastPerformed: '2025-10-01T10:15:00.000Z' },
            scroll: { count: 1, lastPerformed: '2025-10-01T10:05:00.000Z' },
        },
        totalActions: 2
    },
    {
        userId: 3,
        name: 'Charlie',
        actions: {
            scroll: { count: 1, lastPerformed: '2025-10-01T10:20:00.000Z' },
        },
        totalActions: 1
    }
];

/* =========================== Edge Tests ============================== */

// edgeData: deliberately messy inputs to prove robustness.
// Why: production data often includes invalid rows; the function must survive them.
const edgeData = [
    { userId: 10, name: 'X', action: 'click', timestamp: 'bad' },                // invalid timestamp -> skip
    { userId: 10, name: 'X', timestamp: '2025-10-01T00:00:00Z' },                // missing action -> skip
    { name: 'X', action: 'click', timestamp: '2025-10-01T00:00:00Z' },           // missing userId -> skip
    { userId: 11, name: 'Zed', action: 'Click', timestamp: '2025-10-01T00:00:00Z' }, // case normalization test
    { userId: 11, name: 'Zed', action: 'CLICK', timestamp: '2025-10-01T00:10:00Z' }, // same action, different case
    { userId: 12, name: 'Tie', action: 'scroll', timestamp: '2025-10-01T01:00:00Z' }, // equal timestamps tie
    { userId: 12, name: 'Tie', action: 'scroll', timestamp: '2025-10-01T01:00:00Z' }, // tie remains same ISO
    { userId: 13, name: 'Old', action: 'nav', timestamp: '2025-10-01T01:00:00Z' },    // name change scenario
    { userId: 13, name: 'New', action: 'nav', timestamp: '2025-10-01T01:05:00Z' },    // latest name should win
];

// expectedEdges: defines correct behavior on edge cases to lock regressions.
const expectedEdges = [
    {
        userId: 11, name: 'Zed',
        actions: { click: { count: 2, lastPerformed: '2025-10-01T00:10:00.000Z' } },
        totalActions: 2
    },
    {
        userId: 12, name: 'Tie',
        actions: { scroll: { count: 2, lastPerformed: '2025-10-01T01:00:00.000Z' } },
        totalActions: 2
    },
    {
        userId: 13, name: 'New',
        actions: { nav: { count: 2, lastPerformed: '2025-10-01T01:05:00.000Z' } },
        totalActions: 2
    }
];

/* =========================== Large Data ============================== */

// makeLargeData: synthetic generator for stress testing performance.
// Why: validates linear-time behavior and ensures no pathological slowdowns.
function makeLargeData({ users = 2000, actions = ['click','scroll','navigate','input'], eventsPerUser = 150 }) {
    const out = [];                      // holds the generated events
    let ts = Date.parse('2025-01-01T00:00:00Z'); // base timestamp to create strictly increasing times

    // Outer loop: iterate over users to give each a uniform number of events.
    for (let u = 1; u <= users; u++) {
        // Inner loop: create eventsPerUser events per user.
        for (let i = 0; i < eventsPerUser; i++) {
            // Pick an action in a predictable pattern to make verification easier later.
            const a = actions[(u + i) % actions.length];

            // Push a well-formed event object; use toISOString to match normalization in the aggregator.
            out.push({
                userId: u,
                name: `User-${u}`,
                action: a,
                timestamp: new Date(ts).toISOString()
            });

            // Advance timestamp by one second to keep ordering simple and monotonic.
            ts += 1000;
        }
    }
    // Return the full synthetic dataset; caller can size it to millions if desired.
    return out;
}

// verifyLarge: basic probabilistic validation for the large run.
// Why: full equality would be too slow; sampling keeps the test quick yet meaningful.
function verifyLarge(data, report, actions) {
    // Check that total of per-action counts equals raw event count; catches missing/extra aggregation.
    const total = data.length;
    const sum = report.reduce((s, u) => s + Object.values(u.actions).reduce((t, a) => t + a.count, 0), 0);
    if (sum !== total) return false;

    // Spot-check lastPerformed for a random subset of users and actions to ensure max timestamp logic is correct.
    function maxISO(a, b) { return Date.parse(a) > Date.parse(b) ? a : b; }

    for (let i = 0; i < Math.min(40, report.length); i++) {
        const u = report[Math.floor(Math.random() * report.length)];
        const ev = data.filter(e => e.userId === u.userId); // filter user’s events (linear in user’s slice)
        for (const act of actions) {
            // Normalize to lowercase to match default case-insensitive aggregation.
            const cand = ev.filter(e => String(e.action).toLowerCase() === act);
            if (!cand.length) continue;
            const expectedMax = cand.map(e => e.timestamp).reduce(maxISO);
            const got = u.actions[act]?.lastPerformed;
            if (got !== expectedMax) return false; // fail fast if any mismatch
        }
    }
    // If we pass all sampled checks, regard the large test as successful.
    return true;
}

/* =========================== Main Runner ============================= */

// IIFE main: keeps globals clean and runs tests when this file is executed with `node script.js`.
(function main() {
    console.log('=== Dynamic Data Transformation (detailed, with totalActions) ===');

    // 1) Sample dataset test — ensures baseline behavior matches the spec exactly.
    const gotSample = generateUserReport(userData);
    assertEq('Sample dataset', gotSample, expectedSample);

    // 2) Edge cases test — validates robustness against messy/realistic inputs.
    const gotEdges = generateUserReport(edgeData);
    assertEq('Edge cases', gotEdges, expectedEdges);

    // 3) Case-sensitive toggle — proves configurability for consumers who want strict action separation.
    const gotCaseSensitive = generateUserReport(
        [
            { userId: 1, name: 'A', action: 'Click', timestamp: '2025-10-01T00:00:00Z' },
            { userId: 1, name: 'A', action: 'click', timestamp: '2025-10-01T00:10:00Z' }
        ],
        { caseSensitiveActions: true }
    );
    const expectedCaseSensitive = [{
        userId: 1, name: 'A',
        actions: {
            Click: { count: 1, lastPerformed: '2025-10-01T00:00:00.000Z' },
            click: { count: 1, lastPerformed: '2025-10-01T00:10:00.000Z' }
        },
        totalActions: 2
    }];
    assertEq('Case-sensitive mode', gotCaseSensitive, expectedCaseSensitive);

    // 4) Large data stress test — checks performance and correctness at scale (default ~300k events).
    const big = makeLargeData({ users: 1500, eventsPerUser: 200 }); // tweak up to millions as needed
    const t0 = Date.now();                         // start time to report build duration
    const bigReport = generateUserReport(big);     // the heavy aggregation step (should be linear)
    const t1 = Date.now();                         // end time for simple timing
    const ok = verifyLarge(big, bigReport, ['click','scroll','navigate','input']); // quick probabilistic validation
    console.log(`Large data (300k events): ${ok ? 'PASS' : 'FAIL'} | build ~${t1 - t0} ms | users=${bigReport.length}`);

    // 5) Done — consistent end marker helps CI logs.
    console.log('=== Tests complete ===');
})();
