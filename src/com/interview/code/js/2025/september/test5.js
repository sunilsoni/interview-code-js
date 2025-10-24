/* ----------------------------------------------
 * Bounding Rectangle — JavaScript (Node 18+)
 * ---------------------------------------------- */

/**
 * boundingRectangle
 * Finds the smallest axis-aligned rectangle that contains all given points.
 *
 * @param {number[][]} coordinatesPoints - array of points, each point is [x, y]
 * @returns {number[]} [minX, minY, width, height]
 */
function boundingRectangle(coordinatesPoints) {
    // Validate input is an array and has at least two points as per constraint.
    if (!Array.isArray(coordinatesPoints) || coordinatesPoints.length < 2) {
        throw new Error('coordinatesPoints must be an array with at least two [x,y] points');
    }

    // Take the first point as the initial "seed" for all extremes.
    // This avoids having to start with +Infinity/-Infinity and keeps code simple.
    const first = coordinatesPoints[0];           // first point [x0, y0]
    let minX = first[0];                           // current smallest x seen so far
    let minY = first[1];                           // current smallest y seen so far (top)
    let maxX = first[0];                           // current largest  x seen so far (right)
    let maxY = first[1];                           // current largest  y seen so far (bottom)

    // Loop over the rest of the points exactly once — O(n).
    for (let i = 1; i < coordinatesPoints.length; i++) {
        const p = coordinatesPoints[i];             // the i-th point [x, y]
        const x = p[0];                              // extract x for clarity & speed
        const y = p[1];                              // extract y for clarity & speed

        if (x < minX) minX = x;                      // update left edge if we found a smaller x
        if (y < minY) minY = y;                      // update top  edge if we found a smaller y
        if (x > maxX) maxX = x;                      // update right edge if we found a larger  x
        if (y > maxY) maxY = y;                      // update bottom edge if we found a larger y
    }

    // Compute width/height from extremes. If all x are equal, width becomes 0 (valid).
    const width = maxX - minX;                    // width is right - left
    const height = maxY - minY;                    // height is bottom - top

    // Build the required answer format: [left, top, width, height].
    return [minX, minY, width, height];            // final rectangle definition
}

/* --------------------------
 * Minimal test utilities
 * -------------------------- */

/**
 * Shallow compare two arrays of numbers.
 * We avoid any libraries and keep it tiny and readable.
 */
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;       // arrays must be same length
    for (let i = 0; i < a.length; i++) {           // check each element
        if (a[i] !== b[i]) return false;             // mismatch → not equal
    }
    return true;                                   // all elements match
}

/**
 * Pretty printer for PASS/FAIL with timing.
 */
function runTest(name, inputPoints, expected) {
    const t0 = Date.now();                         // start timing (ms)
    const actual = boundingRectangle(inputPoints); // call our function under test
    const t1 = Date.now();                         // end timing (ms)
    const ok = arraysEqual(actual, expected);      // PASS/FAIL check
    const ms = t1 - t0;                            // elapsed time in milliseconds
    console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} | got ${JSON.stringify(actual)} expected ${JSON.stringify(expected)} | ${ms} ms`);
}

/* --------------------------
 * Large-data generator
 * -------------------------- */

/**
 * Make many points guaranteed to lie inside a known rectangle.
 * Ensures we include boundary points so min/max are deterministic.
 *
 * @param {number} ax left (minX)
 * @param {number} ay top  (minY)
 * @param {number} w  width
 * @param {number} h  height
 * @param {number} n  total number of points to generate (>=2)
 * @returns {number[][]} array of [x,y] points
 */
function makePointCloud(ax, ay, w, h, n) {
    const pts = [];
    // Always include exact corners so expected extremes are guaranteed.
    pts.push([ax, ay]);                // top-left
    pts.push([ax + w, ay + h]);        // bottom-right
    // Fill the remaining points randomly inside the rectangle (inclusive).
    for (let i = 2; i < n; i++) {
        // Simple pseudo-randoms using Math.random() — good enough for tests.
        const x = ax + Math.floor(Math.random() * (w + 1));
        const y = ay + Math.floor(Math.random() * (h + 1));
        pts.push([x, y]);
    }
    return pts;
}

/* --------------------------
 * Main method (no JUnit)
 * -------------------------- */

function main() {
    console.log('--- Bounding Rectangle Tests (JavaScript) ---');

    // Test 1: Example matching the spec numbers [2, 39, 99, 91]
    // Points chosen so minX=2, minY=39, maxX=101, maxY=130.
    runTest(
        'Spec-like example',
        [[2, 39], [101, 130], [50, 78]],
        [2, 39, 99, 91]
    );

    // Test 2: Simple two points
    runTest(
        'Two points only',
        [[0, 0], [10, 10]],
        [0, 0, 10, 10]
    );

    // Test 3: Negative coordinates
    runTest(
        'Negative coordinates',
        [[-5, 4], [0, -3], [-2, 7]],
        [-5, -3, 5, 10]
    );

    // Test 4: All points share the same y (height should be 0)
    runTest(
        'Horizontal line (height=0)',
        [[0, 1], [5, 1], [2, 1]],
        [0, 1, 5, 0]
    );

    // Test 5: All points share the same x (width should be 0)
    runTest(
        'Vertical line (width=0)',
        [[3, 0], [3, 10], [3, -4]],
        [3, -4, 0, 14]
    );

    // Test 6: Duplicates and unordered input
    runTest(
        'Duplicates, shuffled',
        [[7, 8], [1, 9], [7, 8], [3, 2], [1, 9], [4, 2]],
        [1, 2, 6, 7]
    );

    // Test 7: Large data (100,000 points) — deterministic bounds.
    // We generate points inside rectangle [ax, ay] to [ax+w, ay+h].
    const ax = -5000, ay = 2000, w = 12345, h = 6789, n = 100000;
    const cloud = makePointCloud(ax, ay, w, h, n);
    runTest(
        `Large data (${n.toLocaleString()} pts)`,
        cloud,
        [ax, ay, w, h]
    );

    console.log('--- End of tests ---');
}

// Run main if this file is executed directly (standard Node pattern).
// This keeps the function importable for other scripts without auto-running tests.
if (require.main === module) {
    main();
}