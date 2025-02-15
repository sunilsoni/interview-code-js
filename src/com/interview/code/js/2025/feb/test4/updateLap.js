function solution(cityLine) {
    // We’ll add a "0" bar at the end to ensure we pop everything out.
    const extended = cityLine.concat([0]);
    const stack = [];  // will store indices of bars
    let maxArea = 0;

    for (let i = 0; i < extended.length; i++) {
        // While current bar is lower than (or equal to) the bar at stack top, pop the top
        while (stack.length && extended[stack[stack.length - 1]] >= extended[i]) {
            const topIndex = stack.pop();
            const height = extended[topIndex];

            // If stack is empty, left boundary is 0, else just after the new stack top
            const leftBoundary = stack.length ? stack[stack.length - 1] + 1 : 0;
            const rightBoundary = i - 1;
            const width = rightBoundary - leftBoundary + 1;

            // For a square, side = min(height, width)
            const side = Math.min(height, width);
            const area = side * side;
            if (area > maxArea) {
                maxArea = area;
            }
        }
        // Push current index
        stack.push(i);
    }

    return maxArea;
}
function main() {
    // Helper to compare actual vs expected
    const check = (cityLine, expected) => {
        const result = solution(cityLine);
        console.log(
            `cityLine=${JSON.stringify(cityLine)} => got ${result}, expected ${expected} :`,
            result === expected ? "PASS" : "FAIL"
        );
    };

    // Example from the problem:
    check([1,2,3,2,1], 4);
    // Because the largest square is 2x2 => area=4

    // Another example from the problem:
    // cityLine = [4,3,4] => largest square side is 3 => area=9
    check([4,3,4], 9);

    // Some edge cases:
    // 1) Single skyscraper
    check([5], 1); // The only square side is 1 => area=1
    // Actually, if the single bar is 5 high and width is 1,
    // the largest square side is min(5,1) = 1 => area=1.

    // 2) All same height
    // If cityLine = [5,5,5,5], we have height=5, width=4 => side=4 => area=16
    check([5,5,5,5], 16);

    // 3) Strictly increasing
    // cityLine = [1,2,3,4]. The widest bar is 4 wide but min height=1 => side=1 => area=1
    // The tallest single bar is 4, but that width=1 => side=1 => area=1
    // The best might be the bar with height=2 and width=2 => side=2 => area=4
    // or the bar with height=3 and width=3 => side=3 => area=9?
    // Actually check carefully: for the bar with height=3, we can only expand left to bars >=3? That’s the 2nd and 3rd bars. The 2nd bar is 2, which is less than 3, so we can’t include it.
    // So that means width=1 for the bar of height=3 => area=1.
    // For the bar with height=2, we can possibly expand 2 bars wide? Indices 1..2 => but the bar at index=2 is height=3 => that’s OK (≥2). So that’s a 2‐width block. side=2 => area=4.
    // The bar with height=3 can expand only 1 wide, so side=1 => area=1.
    // The bar with height=4 can only expand 1 wide => area=1.
    // The best is area=4.
    check([1,2,3,4], 4);

    // 4) Strictly decreasing
    // cityLine = [4,3,2,1]. The first bar is 4 but can expand only 1 wide => side=1 => area=1
    // The second bar is 3, can expand only 1 wide => area=1
    // The third bar is 2, can expand only 1 wide => area=1
    // The last bar is 1, can expand 1 wide => area=1
    // Possibly also the bar with height=2 might expand to the bars to the right if they are >=2? But index=3 is 1, which is <2 => no. So area=1 again.
    check([4,3,2,1], 1);

    // 5) Big test (just for performance check):
    const bigTest = new Array(10_000).fill(1000);
    // side is limited by min(1000, 10_000) => side=1000 => area=1,000,000
    // That’s well below 2^53, so we can store it in a normal Number in JS.
    const resultBig = solution(bigTest);
    console.log("Big test =>", resultBig);
}

// Run the tests
main();
