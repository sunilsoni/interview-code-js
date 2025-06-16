/*
 * Complete the 'longestDuration' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts the following parameters:
 *  1. STRING organizer: the name of the event organizer
 *  2. STRING genre: the genre of the event to check
 *
 * API URL: https://jsonmock.hackerrank.com/api/events?organized_by=<organizer>&page=<pageNumber>
 */

async function longestDuration(organizer, genre) {
    // Helper to build a URL for a given page, encoding the organizer name
    const buildUrl = (page) =>
        `https://jsonmock.hackerrank.com/api/events?organized_by=${encodeURIComponent(organizer)}&page=${page}`;

    let page = 1;
    let totalPages = 1;        // Will be updated after fetching the first page
    let maxDuration = -Infinity;
    let candidateIds = [];     // Holds IDs of events whose duration == maxDuration

    // Fetch page 1 to learn how many pages there are
    try {
        const response = await fetch(buildUrl(page));
        if (!response.ok) {
            // If the request fails, bail out with "-1"
            return "-1";
        }

        const data = await response.json();
        totalPages = data.total_pages;

        // Process the first page’s events
        for (const event of data.data) {
            if (Array.isArray(event.genres) && event.genres.includes(genre)) {
                const dur = event.duration;
                if (dur > maxDuration) {
                    maxDuration = dur;
                    candidateIds = [event.id];
                } else if (dur === maxDuration) {
                    candidateIds.push(event.id);
                }
            }
        }
    } catch (e) {
        return "-1";
    }

    // If there is more than one page, iterate from page 2 through totalPages
    for (page = 2; page <= totalPages; page++) {
        try {
            const response = await fetch(buildUrl(page));
            if (!response.ok) {
                // Skip this page if the request fails
                continue;
            }

            const data = await response.json();
            for (const event of data.data) {
                if (Array.isArray(event.genres) && event.genres.includes(genre)) {
                    const dur = event.duration;
                    if (dur > maxDuration) {
                        maxDuration = dur;
                        candidateIds = [event.id];
                    } else if (dur === maxDuration) {
                        candidateIds.push(event.id);
                    }
                }
            }
        } catch (e) {
            // Ignore errors for this page and continue
            continue;
        }
    }

    // If no matching event was found, return "-1"
    if (candidateIds.length === 0 || maxDuration === -Infinity) {
        return "-1";
    }

    // Sort the IDs lexicographically and return the smallest one
    candidateIds.sort();
    return candidateIds[0];
}