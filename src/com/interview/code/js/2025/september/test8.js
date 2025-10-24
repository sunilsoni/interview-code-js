function translate(text) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let out = '';
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (vowels.has(ch)) {
            const prev = i > 0 ? text[i - 1] : '';
            const next = i + 1 < text.length ? text[i + 1] : '';
            if (!vowels.has(prev) && prev !== 'v' && next !== 'v') {
                out += 'av' + ch;
            } else {
                out += ch;
            }
        } else {
            out += ch;
        }
    }
    return out;
}

function runTests() {
    const tests = [
        {
            input: "hello, secret meeting tonight.",
            expected: "havellavo, savecravet maveetaving tavonavigavht."
        },
        {input: "apple", expected: "avapplave"},
        {input: "banana", expected: "bavanavanava"},
        {input: "sky", expected: "sky"},
        {input: "aeiou", expected: "avaeiou"},
        {input: "cavodavingamave", expected: "cavodavingavamave"},
        {input: "cavodavinavgavamave", expected: "cavodavingavamave"}
    ];

    for (let i = 0; i < tests.length; i++) {
        const out = translate(tests[i].input);
        const pass = out === tests[i].expected;
        console.log(`Test ${i + 1}: ${pass ? "PASS" : "FAIL"} | Output: ${out}${tests[i].expected ? " | Expected: " + tests[i].expected : ""}`);
    }

    const large = 'a'.repeat(250);
    const largeOut = translate(large);
    console.log("Large test:", largeOut.length ? "PASS" : "FAIL", "| Output length:", largeOut.length);
}

runTests();