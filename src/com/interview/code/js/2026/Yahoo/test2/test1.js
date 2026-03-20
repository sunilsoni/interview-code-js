// --- Part 1: Domain Label Extraction ---
const extractDomainLabel = (input) => {
    if (!input) return "";

    // Strip protocol, port, path, query, hash
    const host = input.replace(/^https?:\/\//, '').split(/[/?#:]/)[0];
    const parts = host.split('.');

    if (parts[0] === 'www') parts.shift();
    if (parts.length === 1) return parts[0];

    // Heuristic for compound TLDs (like .co.uk) vs standard (like .com)
    return parts.length >= 3 && parts[parts.length - 2] === 'co'
        ? parts[parts.length - 3]
        : parts[parts.length - 2];
};

// --- Part 2: Word Segmentation ---
const segmentLabel = (label, dict) => {
    if (!label) return [];
    const wordSet = new Set(dict);
    const memo = {};

    const dp = (i) => {
        if (i === label.length) return { tokens: [], cost: 0 };
        if (memo[i]) return memo[i];

        let best = null;

        // Try all possible substrings starting from index 'i'
        for (let j = i + 1; j <= label.length; j++) {
            const word = label.slice(i, j);

            // Cost logic: dict words cost 1. Unknowns get a massive penalty based on length.
            // The "+ 1" ensures one long unknown chunk is cheaper than multiple short unknown chunks.
            const cost = wordSet.has(word) ? 1 : (word.length * 1000) + 1;
            const next = dp(j);
            const totalCost = cost + next.cost;

            // Track the lowest cost path
            if (!best || totalCost < best.cost) {
                best = { tokens: [word, ...next.tokens], cost: totalCost };
            }
        }
        return memo[i] = best;
    };

    return dp(0).tokens;
};

// --- Part 3: Put It Together ---
const tokenizeDomain = (input, dict) => {
    if (!input) return [];
    const domain = extractDomainLabel(input);

    // Split on hyphens/underscores, then segment each piece
    return domain.split(/[-_]/).flatMap(part => segmentLabel(part, dict));
};