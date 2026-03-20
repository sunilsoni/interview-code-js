// ============================================================================
// Dictionary (provided - do not modify)
// ============================================================================
const dictionary = [
    "a", "about", "air", "all", "amazon", "auto", "ball", "bank", "best",
    "book", "books", "buy", "car", "cars", "cheap", "clean", "club", "company",
    "cool", "day", "deal", "deals", "direct", "dream", "dress", "drive",
    "electronics", "energy", "express", "fast", "finance", "find", "fire",
    "first", "flights", "food", "foot", "football", "free", "fun", "game",
    "games", "global", "gold", "good", "green", "health", "home", "hot",
    "house", "hub", "hunt", "in", "info", "jobs", "just", "king", "land",
    "life", "light", "line", "link", "live", "love", "market", "mart", "max",
    "media", "mega", "mind", "mobile", "mon", "monday", "money", "motor",
    "music", "my", "net", "network", "new", "news", "next", "nig", "night",
    "now", "offer", "offers", "one", "online", "open", "out", "over", "page",
    "park", "pay", "pet", "pets", "phone", "plan", "play", "plus", "point",
    "power", "press", "prime", "pro", "quest", "quick", "rate", "real",
    "red", "rent", "ride", "rock", "run", "running", "safe", "sale", "save",
    "search", "share", "shop", "shopping", "show", "site", "smart", "snap",
    "solar", "source", "space", "sport", "sports", "star", "start", "stop",
    "store", "stream", "sun", "super", "supply", "surf", "tech", "the",
    "these", "time", "top", "total", "trade", "travel", "trend", "trust",
    "tv", "up", "value", "video", "view", "vision", "watch", "water", "way",
    "web", "well", "west", "wild", "win", "wire", "wireless", "wise", "work",
    "world", "yoga", "zone"
];

// ============================================================================
// Part 1: Domain Label Extraction
// ============================================================================
const extractDomainLabel = (input) => {
    if (!input) return "";
    const parts = input.replace(/^https?:\/\//, '').split(/[/?#:]/)[0].split('.');
    if (parts[0] === 'www') parts.shift();
    if (parts.length === 1) return parts[0];

    // Handles TLDs like .com and compound TLDs like .co.uk
    return parts.length >= 3 && parts[parts.length - 2] === 'co'
        ? parts[parts.length - 3]
        : parts[parts.length - 2];
};

// ============================================================================
// Part 2: Word Segmentation (Using minimal DP)
// ============================================================================
const segmentLabel = (label, dict) => {
    if (!label) return [];
    const wordSet = new Set(dict), memo = {};

    const dp = (i) => {
        if (i === label.length) return { tokens: [], cost: 0 };
        if (memo[i]) return memo[i];

        let best = null;
        for (let j = i + 1; j <= label.length; j++) {
            const word = label.slice(i, j);
            // Cost: 1 for known words. For unknown, base it heavily on length so adjacent unknown chars combine.
            const cost = wordSet.has(word) ? 1 : (word.length * 1000) + 1;
            const { tokens, cost: nextCost } = dp(j);

            if (!best || cost + nextCost < best.cost) {
                best = { tokens: [word, ...tokens], cost: cost + nextCost };
            }
        }
        return memo[i] = best;
    };

    return dp(0).tokens;
};

// ============================================================================
// Part 3: Put It Together
// ============================================================================
const tokenizeDomain = (input, dict) =>
    input ? extractDomainLabel(input).split(/[-_]/).flatMap(p => segmentLabel(p, dict)) : [];

// ============================================================================
// Test Runner (do not modify below this line)
// ============================================================================

let passed = 0;
let failed = 0;

function assert(testName, actual, expected) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr === expectedStr) {
        passed++;
        console.log(`  PASS: ${testName}`);
    } else {
        failed++;
        console.log(`  FAIL: ${testName}`);
        console.log(`    expected: ${expectedStr}`);
        console.log(`    actual:   ${actualStr}`);
    }
}

console.log("\n--- Part 1: extractDomainLabel ---\n");
assert("full URL with path", extractDomainLabel("https://www.mondaynightfootball.com/page"), "mondaynightfootball");
assert("URL without www", extractDomainLabel("https://mondaynightfootball.com"), "mondaynightfootball");
assert("hostname with www", extractDomainLabel("www.mondaynightfootball.com"), "mondaynightfootball");
assert("bare domain", extractDomainLabel("mondaynightfootball.com"), "mondaynightfootball");
assert("single label (no dots)", extractDomainLabel("mondaynightfootball"), "mondaynightfootball");
assert("compound TLD (.co.uk)", extractDomainLabel("shop.bestbuy.co.uk"), "bestbuy");
assert("with query string", extractDomainLabel("http://cheapflights.com?src=google"), "cheapflights");
assert("with port", extractDomainLabel("http://mysite.com:8080/path"), "mysite");
assert("empty input", extractDomainLabel(""), "");
assert("null input", extractDomainLabel(null), "");

console.log("\n--- Part 2: segmentLabel ---\n");
assert("monday night football", segmentLabel("mondaynightfootball", dictionary), ["monday", "night", "football"]);
assert("the dress company (shared prefix with 'these')", segmentLabel("thedresscompany", dictionary), ["the", "dress", "company"]);
assert("unknown prefix", segmentLabel("xyzfootball", dictionary), ["xyz", "football"]);
assert("unknown in middle", segmentLabel("mondayxyzfootball", dictionary), ["monday", "xyz", "football"]);
assert("all unknown", segmentLabel("qxzwvk", dictionary), ["qxzwvk"]);
assert("empty label", segmentLabel("", dictionary), []);
assert("exact single word", segmentLabel("football", dictionary), ["football"]);
assert("prefers fewer tokens (monday over mon+day)", segmentLabel("monday", dictionary), ["monday"]);
assert("cheap flights", segmentLabel("cheapflights", dictionary), ["cheap", "flights"]);
assert("best buy electronics", segmentLabel("bestbuyelectronics", dictionary), ["best", "buy", "electronics"]);
assert("unknown suffix", segmentLabel("footballxyz", dictionary), ["football", "xyz"]);
assert("single character (a is in dict)", segmentLabel("a", dictionary), ["a"]);
assert("online shopping deals", segmentLabel("onlineshoppingdeals", dictionary), ["online", "shopping", "deals"]);

console.log("\n--- Part 3: tokenizeDomain ---\n");
assert("full URL", tokenizeDomain("https://www.mondaynightfootball.com/sale", dictionary), ["monday", "night", "football"]);
assert("hyphenated domain", tokenizeDomain("my-dream-house.com", dictionary), ["my", "dream", "house"]);
assert("underscore domain", tokenizeDomain("best_buy.com", dictionary), ["best", "buy"]);
assert("mixed hyphens and concat", tokenizeDomain("super-smarthome.com", dictionary), ["super", "smart", "home"]);
assert("simple domain", tokenizeDomain("cheapflights.com", dictionary), ["cheap", "flights"]);
assert("bare label with hyphens", tokenizeDomain("online-mega-store", dictionary), ["online", "mega", "store"]);
assert("empty input", tokenizeDomain("", dictionary), []);

// ----------------------------------------------------------------------------
console.log(`\n=================================================`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
console.log(`=================================================\n`);

if (failed > 0) process.exit(1);