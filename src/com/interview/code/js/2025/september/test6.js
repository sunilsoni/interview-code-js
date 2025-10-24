function boundingRectangle(coordinatesPoints) {
    if (!Array.isArray(coordinatesPoints) || coordinatesPoints.length < 2) {
        throw new Error('coordinatesPoints must be an array with at least two [x,y] points');
    }
    const first = coordinatesPoints[0];
    let minX = first[0], minY = first[1], maxX = first[0], maxY = first[1];
    for (let i = 1; i < coordinatesPoints.length; i++) {
        const p = coordinatesPoints[i];
        const x = p[0], y = p[1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }
    const width = maxX - minX;
    const height = maxY - minY;
    return [minX, minY, width, height];
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

function runTest(name, inputPoints, expected) {
    const t0 = Date.now();
    const actual = boundingRectangle(inputPoints);
    const t1 = Date.now();
    const ok = arraysEqual(actual, expected);
    console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} | got ${JSON.stringify(actual)} expected ${JSON.stringify(expected)} | ${t1 - t0} ms`);
}

function makePointCloud(ax, ay, w, h, n) {
    const pts = [];
    pts.push([ax, ay]);
    pts.push([ax + w, ay + h]);
    for (let i = 2; i < n; i++) {
        const x = ax + Math.floor(Math.random() * (w + 1));
        const y = ay + Math.floor(Math.random() * (h + 1));
        pts.push([x, y]);
    }
    return pts;
}

function main() {
    console.log('--- Bounding Rectangle Tests (JavaScript) ---');
    runTest('Spec-like example', [[2, 39], [101, 130], [50, 78]], [2, 39, 99, 91]);
    runTest('Two points only', [[0, 0], [10, 10]], [0, 0, 10, 10]);
    runTest('Negative coordinates', [[-5, 4], [0, -3], [-2, 7]], [-5, -3, 5, 10]);
    runTest('Horizontal line (height=0)', [[0, 1], [5, 1], [2, 1]], [0, 1, 5, 0]);
    runTest('Vertical line (width=0)', [[3, 0], [3, 10], [3, -4]], [3, -4, 0, 14]);
    runTest('Duplicates, shuffled', [[7, 8], [1, 9], [7, 8], [3, 2], [1, 9], [4, 2]], [1, 2, 6, 7]);
    const ax = -5000, ay = 2000, w = 12345, h = 6789, n = 100000;
    const cloud = makePointCloud(ax, ay, w, h, n);
    runTest(`Large data (${n.toLocaleString()} pts)`, cloud, [ax, ay, w, h]);
    console.log('--- End of tests ---');
}

if (typeof require !== 'undefined' && require.main === module) {
    main();
}

module.exports = {boundingRectangle};