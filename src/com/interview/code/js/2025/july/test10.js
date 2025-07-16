/**
 * halfway_course finds the course at which a student
 * is halfway through a linear curriculum.
 *
 * @param {Array<Array<string>>} pairs
 *   List of [prerequisiteCourse, dependentCourse] pairs.
 * @returns {string}
 *   The name of the halfway course (first of the two if even-length).
 */
function halfway_course(pairs) {
    // 1) Build a map from each course → its direct dependent
    //    Since there's exactly one path, each course appears at most once as a key.
    const nextCourse = {};           // e.g. { "Algorithms": "Foundations of CS", ... }
    const allPrereqs = new Set();    // courses that appear as a prerequisite
    const allDependents = new Set(); // courses that appear as a dependent

    for (const [pre, dep] of pairs) {
        nextCourse[pre] = dep;         // record the edge pre → dep
        allPrereqs.add(pre);           // mark pre seen
        allDependents.add(dep);        // mark dep seen
    }

    // 2) Find the **start** of the path: it's the prereq
    //    that never appears as a dependent.
    let start = null;
    for (const pre of allPrereqs) {
        if (!allDependents.has(pre)) {
            start = pre;
            break;
        }
    }
    // If no start found (e.g. single-pair or malformed), fall back:
    if (start === null) {
        // If there is exactly one pair, its prereq is halfway by definition
        return pairs[0][0];
    }

    // 3) Count total courses = pairs + 1
    const totalCourses = pairs.length + 1;

    // 4) Compute the 0-based index of the halfway course:
    //    - If odd total, floor(total/2).
    //    - If even total, we want the *first* of the two middles => (total/2 - 1).
    const idx = (totalCourses % 2 === 0)
        ? (totalCourses / 2 - 1)
        : Math.floor(totalCourses / 2);

    // 5) Walk the chain from start, idx steps to reach the halfway course
    let current = start;             // position 0
    for (let i = 0; i < idx; i++) {
        current = nextCourse[current]; // advance one course
    }

    // 6) Return the course at that halfway position
    return current;
}

//----------------------------------------
// Test harness
//----------------------------------------

/**
 * Runs each test and logs PASS/FAIL.
 */
function runTests() {
    const tests = [
        {
            name: "Sample 1",
            pairs: [
                ["Foundations of Computer Science","Operating Systems"],
                ["Data Structures","Algorithms"],
                ["Computer Networks","Computer Architecture"],
                ["Algorithms","Foundations of Computer Science"],
                ["Computer Architecture","Data Structures"],
                ["Software Design","Computer Networks"]
            ],
            expected: "Data Structures"
        },
        {
            name: "Sample 2",
            pairs: [
                ["Algorithms","Foundations of Computer Science"],
                ["Data Structures","Algorithms"],
                ["Foundations of Computer Science","Logic"],
                ["Logic","Compilers"],
                ["Compilers","Distributed Systems"]
            ],
            expected: "Foundations of Computer Science"
        },
        {
            name: "Sample 3",
            pairs: [
                ["Data Structures","Algorithms"]
            ],
            expected: "Data Structures"
        },
        {
            name: "Large chain of 101",
            // build 100 pairs: C1→C2, C2→C3, …, C100→C101
            pairs: Array.from({ length: 100 }, (_, i) => [`C${i+1}`, `C${i+2}`]),
            // totalCourses = 101 => idx = floor(101/2)=50 => course at position 50 is C51
            expected: "C51"
        }
    ];

    for (const {name, pairs, expected} of tests) {
        const actual = halfway_course(pairs);
        const pass = actual === expected;
        console.log(`${name}: ${pass ? "PASS" : "FAIL"}`);
        if (!pass) {
            console.log("  Expected:", expected);
            console.log("  Actual:  ", actual);
        }
    }
}

// Execute all tests
runTests();