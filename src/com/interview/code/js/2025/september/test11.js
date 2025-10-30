/**
 * Javascript Version: Node.js 18+ (works on Node 12+ too)
 * Simple, framework-free runner that prints PASS/FAIL.
 */

/**
 * Build the per-user report.
 * @param {Array} data - Array of { userId, name, action, timestamp }
 * @param {Object} [opts]
 * @param {boolean} [opts.normalizeActionCase=true] - lowercases action keys
 * @returns {Array} [{ userId, name, actions: { [action]: { count, lastTimestamp } } }]
 */
function generateUserReport(data, opts = {}) {
    const { normalizeActionCase = true } = opts;
    const users = new Map();

    for (const rec of data || []) {
        if (!rec || rec.userId === undefined || rec.userId === null) continue;
        if (!rec.action || !rec.timestamp) continue;

        const actionKey = normalizeActionCase ? String(rec.action).toLowerCase() : String(rec.action);
        const t = Date.parse(rec.timestamp);
        if (Number.isNaN(t)) continue;

        let u = users.get(rec.userId);
        if (!u) {
            u = { userId: rec.userId, name: rec.name ?? null, actions: Object.create(null) };
            users.set(rec.userId, u);
        } else if (rec.name) {
            // Keep the last non-empty name we see
            u.name = rec.name;
        }

        const cur = u.actions[actionKey] || { count: 0, lastTimestamp: null };
        cur.count += 1;

        if (cur.lastTimestamp === null || t > Date.parse(cur.lastTimestamp)) {
            cur.lastTimestamp = new Date(t).toISOString();
        }
        u.actions[actionKey] = cur;
    }

    // Return as array; keep insertion order of userIds
    return Array.from(users.values()).map(u => ({
        userId: u.userId,
        name: u.name ?? null,
        actions: Object.fromEntries(
            Object.entries(u.actions).map(([k, v]) => [k, { count: v.count, lastTimestamp: v.lastTimestamp }])
        )
    }));
}

/* ----------------------- Test Utilities ----------------------- */

function deepSort(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepSort).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    } else if (obj && typeof obj === 'object') {
        const sorted = {};
        for (const key of Object.keys(obj).sort()) {
            sorted[key] = deepSort(obj[key]);
        }
        return sorted;
    }
    return obj;
}

function isDeepEqual(a, b) {
    return JSON.stringify(deepSort(a)) === JSON.stringify(deepSort(b));
}

function assertEq(name, got, expected) {
    const ok = isDeepEqual(got, expected);
    const status = ok ? 'PASS' : 'FAIL';
    console.log(`${name}: ${status}`);
    if (!ok) {
        console.log('--- Expected ---');
        console.log(JSON.stringify(expected, null, 2));
        console.log('---   Got    ---');
        console.log(JSON.stringify(got, null, 2));
    }
    return ok;
}

/* ----------------------- Sample Data from prompt ----------------------- */
const userData = [
    { userId: 1, name: 'Alice',   action: 'click',    timestamp: '2025-10-01T10:00:00Z' },
    { userId: 2, name: 'Bob',     action: 'scroll',   timestamp: '2025-10-01T10:05:00Z' },
    { userId: 1, name: 'Alice',   action: 'click',    timestamp: '2025-10-01T10:10:00Z' },
    { userId: 1, name: 'Alice',   action: 'navigate', timestamp: '2025-10-01T10:12:00Z' },
    { userId: 2, name: 'Bob',     action: 'click',    timestamp: '2025-10-01T10:15:00Z' },
    { userId: 3, name: 'Charlie', action: 'scroll',   timestamp: '2025-10-01T10:20:00Z' },
];

/* ----------------------- Expected for sample ----------------------- */
const expectedSample = [
    {
        userId: 1,
        name: 'Alice',
        actions: {
            click:    { count: 2, lastTimestamp: '2025-10-01T10:10:00.000Z' },
            navigate: { count: 1, lastTimestamp: '2025-10-01T10:12:00.000Z' }
        }
    },
    {
        userId: 2,
        name: 'Bob',
        actions: {
            scroll: { count: 1, lastTimestamp: '2025-10-01T10:05:00.000Z' },
            click:  { count: 1, lastTimestamp: '2025-10-01T10:15:00.000Z' }
        }
    },
    {
        userId: 3,
        name: 'Charlie',
        actions: {
            scroll: { count: 1, lastTimestamp: '2025-10-01T10:20:00.000Z' }
        }
    }
];

/* ----------------------- Edge Cases ----------------------- */
const edgeCases = [
    // invalid timestamp → skipped
    { userId: 10, name: 'X', action: 'click', timestamp: 'invalid' },
    // missing action → skipped
    { userId: 10, name: 'X', timestamp: '2025-10-01T00:00:00Z' },
    // missing userId → skipped
    { name: 'X', action: 'click', timestamp: '2025-10-01T00:00:00Z' },
    // action casing normalization
    { userId: 11, name: 'Zed', action: 'Click', timestamp: '2025-10-01T00:00:00Z' },
    { userId: 11, name: 'Zed', action: 'CLICK', timestamp: '2025-10-01T00:10:00Z' },
    // same timestamp tie (keeps last seen, but timestamp value is same)
    { userId: 12, name: 'Tie', action: 'scroll', timestamp: '2025-10-01T01:00:00Z' },
    { userId: 12, name: 'Tie', action: 'scroll', timestamp: '2025-10-01T01:00:00Z' },
    // name changes for same userId (keep last non-empty)
    { userId: 13, name: 'Old', action: 'nav', timestamp: '2025-10-01T01:00:00Z' },
    { userId: 13, name: 'New', action: 'nav', timestamp: '2025-10-01T01:05:00Z' },
];

const expectedEdges = [
    {
        userId: 11, name: 'Zed',
        actions: { click: { count: 2, lastTimestamp: '2025-10-01T00:10:00.000Z' } }
    },
    {
        userId: 12, name: 'Tie',
        actions: { scroll: { count: 2, lastTimestamp: '2025-10-01T01:00:00.000Z' } }
    },
    {
        userId: 13, name: 'New',
        actions: { nav: { count: 2, lastTimestamp: '2025-10-01T01:05:00.000Z' } }
    }
];

/* ----------------------- Large Data Generator ----------------------- */
function makeLargeData({ users = 1000, actions = ['click','scroll','navigate','input'], eventsPerUser = 200 }) {
    const out = [];
    let ts = Date.parse('2025-01-01T00:00:00Z');
    for (let u = 1; u <= users; u++) {
        for (let i = 0; i < eventsPerUser; i++) {
            const a = actions[(u + i) % actions.length];
            out.push({
                userId: u,
                name: `User-${u}`,
                action: a,
                timestamp: new Date(ts).toISOString()
            });
            ts += 1000; // +1s
        }
    }
    return out;
}

function verifyLargeDataReport(data, report, actionsList) {
    // 1) total events = sum of all per-action counts
    const totalEvents = data.length;
    const sumCounts = report.reduce((acc, u) =>
        acc + Object.values(u.actions).reduce((s, a) => s + a.count, 0), 0);
    if (sumCounts !== totalEvents) return false;

    // 2) lastTimestamp sanity: for a random sample of users/actions, recompute max
    function maxISO(a, b) { return (Date.parse(a) > Date.parse(b)) ? a : b; }

    for (let sample = 0; sample < Math.min(50, report.length); sample++) {
        const u = report[Math.floor(Math.random() * report.length)];
        const userEvents = data.filter(e => e.userId === u.userId);
        for (const act of actionsList) {
            const ev = userEvents.filter(e => String(e.action).toLowerCase() === act);
            if (ev.length === 0) continue;
            const expectedLast = ev.map(e => e.timestamp).reduce(maxISO);
            const got = u.actions[act]?.lastTimestamp;
            if (got !== expectedLast) return false;
        }
    }
    return true;
}

/* ----------------------- Main Runner ----------------------- */
(function main() {
    console.log('=== Dynamic Data Transformation Tests ===');

    // Sample
    const sampleGot = generateUserReport(userData);
    assertEq('Sample dataset', sampleGot, expectedSample);

    // Edges
    const edgesGot = generateUserReport(edgeCases);
    assertEq('Edge cases', edgesGot, expectedEdges);

    // Case-sensitive toggle check
    const caseSensitiveGot = generateUserReport(
        [{ userId: 1, name: 'A', action: 'Click', timestamp: '2025-10-01T00:00:00Z' },
            { userId: 1, name: 'A', action: 'click', timestamp: '2025-10-01T00:10:00Z' }],
        { normalizeActionCase: false }
    );
    const expectedCaseSensitive = [{
        userId: 1, name: 'A',
        actions: {
            Click: { count: 1, lastTimestamp: '2025-10-01T00:00:00.000Z' },
            click: { count: 1, lastTimestamp: '2025-10-01T00:10:00.000Z' }
        }
    }];
    assertEq('Case-sensitive mode', caseSensitiveGot, expectedCaseSensitive);

    // Large data test
    const big = makeLargeData({ users: 1000, eventsPerUser: 200 }); // 200k events
    const t0 = Date.now();
    const bigReport = generateUserReport(big);
    const t1 = Date.now();
    const okBig = verifyLargeDataReport(big, bigReport, ['click','scroll','navigate','input']);
    const durationMs = t1 - t0;
    console.log(`Large data (200k events): ${okBig ? 'PASS' : 'FAIL'} | build time ~${durationMs} ms | users=${bigReport.length}`);

    // Final summary
    console.log('=== Tests complete ===');
})();
