/**
 * find_pairs as before: always produces keys "id1,id2" with id1 < id2
 */
function find_pairs(enrollments) {
    const studentCourses = {};
    for (const [sid, course] of enrollments) {
        if (!studentCourses[sid]) studentCourses[sid] = new Set();
        studentCourses[sid].add(course);
    }
    const ids = Object.keys(studentCourses).sort((a,b)=>Number(a)-Number(b));
    const result = {};
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const a = ids[i], b = ids[j];
            const shared = [];
            for (const c of studentCourses[a]) {
                if (studentCourses[b].has(c)) shared.push(c);
            }
            result[`${a},${b}`] = shared;
        }
    }
    return result;
}

//── your three sample inputs ──────────────────────────────────────────────────

const enrollments1 = [
    ["58","Linear Algebra"],["94","Art History"],["94","Operating Systems"],
    ["17","Software Design"],["58","Mechanics"],["58","Economics"],
    ["17","Linear Algebra"],["17","Political Science"],["94","Economics"],
    ["25","Economics"],["58","Software Design"]
];

const enrollments2 = [
    ["0","Advanced Mechanics"],["0","Art History"],
    ["1","Course 1"],["1","Course 2"],
    ["2","Computer Architecture"],
    ["3","Course 1"],["3","Course 2"],
    ["4","Algorithms"]
];

const enrollments3 = [
    ["23","Software Design"],
    ["3","Advanced Mechanics"],
    ["2","Art History"],
    ["33","Another"]
];

//── the “expected” definitions (unchanged) ───────────────────────────────────

const expected1 = {
    "17,58": ["Software Design","Linear Algebra"],
    "17,94": [],
    "17,25": [],
    "58,94": ["Economics"],
    "58,25": ["Economics"],
    "94,25": ["Economics"]
};

const expected2 = {
    "0,1": [],
    "2,0": [],
    "2,1": [],
    "3,0": [],
    "3,1": ["Course 1","Course 2"],
    "3,2": [],
    "4,0": [],
    "4,1": [],
    "4,2": [],
    "4,3": []
};

const expected3 = {
    "23,3": [],
    "23,2": [],
    "23,33": [],
    "3,2": [],
    "3,33": [],
    "2,33": []
};

//── deep‐compare treating "a,b" ≡ "b,a" ────────────────────────────────────────
function deepEqualUnorderedPairs(actual, expected) {
    const seen = new Set();
    // for every key in actual, find a matching key in expected
    for (const key of Object.keys(actual)) {
        const [x,y] = key.split(",");
        const rev = `${y},${x}`;
        const valA = actual[key];
        let valB = null, matchKey = null;
        if (expected.hasOwnProperty(key)) {
            valB = expected[key];
            matchKey = key;
        } else if (expected.hasOwnProperty(rev)) {
            valB = expected[rev];
            matchKey = rev;
        } else {
            return false; // no such pair in expected
        }
        // compare arrays
        if (valA.length !== valB.length) return false;
        for (let i = 0; i < valA.length; i++) {
            if (valA[i] !== valB[i]) return false;
        }
        seen.add(matchKey);
    }
    // ensure expected has no extra keys
    for (const key of Object.keys(expected)) {
        const [x,y] = key.split(",");
        const rev = `${y},${x}`;
        if (!seen.has(key) && !seen.has(rev)) {
            return false;
        }
    }
    return true;
}

//── run the tests ─────────────────────────────────────────────────────────────
const tests = [
    { name: "Sample 1", enrollments: enrollments1, expected: expected1 },
    { name: "Sample 2", enrollments: enrollments2, expected: expected2 },
    { name: "Sample 3", enrollments: enrollments3, expected: expected3 },
];

function runTests() {
    for (const {name, enrollments, expected} of tests) {
        const actual = find_pairs(enrollments);
        const pass = deepEqualUnorderedPairs(actual, expected);
        console.log(`${name}: ${pass ? "PASS" : "FAIL"}`);
        if (!pass) {
            console.log("  Expected:", expected);
            console.log("  Actual:  ", actual);
        }
    }
}

runTests();