// Compute total minutes an officer spends on calls
function getOfficerCallMinutes(officerId, data) {
    // 1. Extract only the shifts belonging to this officer
    const officerShifts = data.shifts
        .filter(s => s.officerId === officerId);

    // 2. For each dispatch, we may count overlap only if its vehicle matches a shift
    let totalMs = 0; // we'll accumulate milliseconds

    // 3. Iterate every shift and every dispatch to compute overlaps
    for (const shift of officerShifts) {
        for (const disp of data.dispatches) {
            if (disp.vehicleId !== shift.vehicleId) continue;

            // Determine overlap window:
            const overlapStart = new Date(Math.max(
                shift.startShift.getTime(),
                disp.startCall.getTime()
            ));
            const overlapEnd = new Date(Math.min(
                shift.endShift.getTime(),
                disp.endCall.getTime()
            ));

            // Compute duration if there is an overlap
            const diff = overlapEnd - overlapStart;
            if (diff > 0) {
                totalMs += diff;
            }
        }
    }

    // Convert ms → minutes and return
    return Math.floor(totalMs / 60000);
}

// Simple main() to run and validate test cases
function main() {
    const tests = [];

    // — Example from the prompt —
    (() => {
        // Shifts for Officer1
        const shifts = [
            { id: 's1', officerId: 'o1', vehicleId: 'v1',
                startShift: new Date('2025-09-16T11:00:00'),
                endShift:   new Date('2025-09-16T15:00:00') },
            { id: 's2', officerId: 'o1', vehicleId: 'v2',
                startShift: new Date('2025-09-16T06:00:00'),
                endShift:   new Date('2025-09-16T09:00:00') },
        ];
        // Dispatches (calls)
        const dispatches = [
            { id: 'd1', vehicleId: 'v1', callId: 'c1',
                startCall: new Date('2025-09-16T09:00:00'),
                endCall:   new Date('2025-09-16T12:00:00') },
            { id: 'd2', vehicleId: 'v2', callId: 'c2',
                startCall: new Date('2025-09-16T02:00:00'),
                endCall:   new Date('2025-09-16T05:00:00') },
            { id: 'd3', vehicleId: 'v2', callId: 'c3',
                startCall: new Date('2025-09-16T07:00:00'),
                endCall:   new Date('2025-09-16T10:00:00') },
        ];
        tests.push({
            name: 'Prompt example',
            data: { shifts, dispatches },
            officerId: 'o1',
            expected: 180
        });
    })();

    // — Edge case: no shifts —
    tests.push({
        name: 'No shifts',
        data: { shifts: [], dispatches: [{ /* ... */ }] },
        officerId: 'oX',
        expected: 0
    });

    // — Large random test to check performance —
    (() => {
        const N = 10_000;
        const shifts = [];
        const dispatches = [];
        for (let i = 0; i < N; i++) {
            shifts.push({
                id: `s${i}`,
                officerId: i % 2 === 0 ? 'oBig' : 'oOther',
                vehicleId: `v${i % 100}`,
                startShift: new Date(1_600_000_000_000 + i * 100_000),
                endShift:   new Date(1_600_000_000_000 + i * 100_000 + 60 * 60_000),
            });
            dispatches.push({
                id: `d${i}`,
                vehicleId: `v${i % 100}`,
                callId: `c${i}`,
                startCall: new Date(1_600_000_000_000 + i * 90_000),
                endCall:   new Date(1_600_000_000_000 + i * 90_000 + 30 * 60_000),
            });
        }
        tests.push({
            name: 'Large performance test',
            data: { shifts, dispatches },
            officerId: 'oBig',
            expected: null  // we won’t assert a fixed number here
        });
    })();

    // Run them
    for (const { name, data, officerId, expected } of tests) {
        const t0 = Date.now();
        const result = getOfficerCallMinutes(officerId, data);
        const dt = Date.now() - t0;
        const pass = expected === null ? 'OK' : (result === expected ? 'PASS' : 'FAIL');
        console.log(
            `[${pass}] ${name}: got=${result}` +
            (expected !== null ? `, want=${expected}` : '') +
            ` (${dt} ms)`
        );
    }
}

// Invoke our test harness
main();