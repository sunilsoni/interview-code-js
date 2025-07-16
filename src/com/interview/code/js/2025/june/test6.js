function marchingBand(N, houses, M, K) {
    let maxUniformity = 0;

    // Check for each unique house in a single pass using sliding window
    let houseCounts = new Map();
    let left = 0, maxCount = 0;

    for (let right = 0; right < N; right++) {
        const house = houses[right];
        houseCounts.set(house, (houseCounts.get(house) || 0) + 1);
        maxCount = Math.max(maxCount, houseCounts.get(house));

        // If removals required exceed K, shrink window
        while ((right - left + 1) - maxCount > K) {
            houseCounts.set(houses[left], houseCounts.get(houses[left]) - 1);
            left++;
        }

        // Update maxUniformity
        maxUniformity = Math.max(maxUniformity, right - left + 1);
    }

    return maxUniformity;
}