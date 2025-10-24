// Define a Shift: when an officer is assigned to a vehicle
class Shift {
    constructor(id, officerId, vehicleId, startTime, endTime) {
        this.id = id;               // unique shift ID
        this.officerId = officerId; // which officer
        this.vehicleId = vehicleId; // which vehicle
        this.startTime = startTime; // shift start in minutes since midnight
        this.endTime = endTime;     // shift end in minutes since midnight
    }
}

// Define a Dispatch: when a vehicle is sent to a call
class Dispatch {
    constructor(id, vehicleId, callId, startTime, endTime) {
        this.id = id;               // unique dispatch ID
        this.vehicleId = vehicleId; // vehicle handling the call
        this.callId = callId;       // call identifier
        this.startTime = startTime; // call start time in minutes
        this.endTime = endTime;     // call end time in minutes
    }
}

// Main system holding all shifts and dispatches
class PoliceSystem {
    constructor() {
        this.shifts = [];     // list of all Shift objects
        this.dispatches = []; // list of all Dispatch objects
    }

    // Add a shift record
    addShift(shift) {
        this.shifts.push(shift);
    }

    // Add a dispatch record
    addDispatch(dispatch) {
        this.dispatches.push(dispatch);
    }

    // Return true if [start1,end1] and [start2,end2] overlap
    hasTimeOverlap(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }

    // Compute overlap in minutes between two intervals
    calculateOverlapMinutes(start1, end1, start2, end2) {
        const overlapStart = Math.max(start1, start2); // later of the two starts
        const overlapEnd = Math.min(end1, end2);   // earlier of the two ends
        return Math.max(0, overlapEnd - overlapStart); // positive overlap or zero
    }

    // Main: total minutes an officer spends on calls
    calculateOfficerCallTime(officerId) {
        let total = 0; // accumulate minutes

        // 1. Take only the shifts for this officer
        const myShifts = this.shifts.filter(s => s.officerId === officerId);

        // 2. For each shift, find dispatches on the same vehicle that overlap
        myShifts.forEach(shift => {
            const relevant = this.dispatches.filter(d =>
                d.vehicleId === shift.vehicleId &&                            // same vehicle
                this.hasTimeOverlap(shift.startTime, shift.endTime,          // overlapping?
                    d.startTime, d.endTime)
            );

            // 3. For each overlapping dispatch, add the overlap minutes
            relevant.forEach(d => {
                total += this.calculateOverlapMinutes(
                    shift.startTime, shift.endTime,
                    d.startTime, d.endTime
                );
            });
        });

        return total; // final total minutes on calls
    }
}

// ---- Test harness (simple main) ----
function main() {
    // Build our example from the prompt:
    // Vehicle1: call 9–12
    // Vehicle2: calls 2–5 and 7–10
    // Officer1: shifts 11–15 on vehicle1, 6–9 on vehicle2
    const sys = new PoliceSystem();

    // Shifts for officer1
    sys.addShift(new Shift(1, "officer1", "vehicle1", 11 * 60, 15 * 60)); // 11:00–15:00 → [660,900]
    sys.addShift(new Shift(2, "officer1", "vehicle2", 6 * 60, 9 * 60)); //  6:00–09:00 → [360,540]

    // Dispatches (calls)
    sys.addDispatch(new Dispatch(1, "vehicle1", "call1", 9 * 60, 12 * 60)); //  9:00–12:00 → [540,720]
    sys.addDispatch(new Dispatch(2, "vehicle2", "call2", 2 * 60, 5 * 60)); //  2:00–05:00 → [120,300]
    sys.addDispatch(new Dispatch(3, "vehicle2", "call3", 7 * 60, 10 * 60)); //  7:00–10:00 → [420,600]

    // Run the calculation
    const result = sys.calculateOfficerCallTime("officer1");

    // Expected:
    // * call1 overlap 11–12 on vehicle1 = 60
    // * call2 has no overlap on vehicle2 (shift is 6–9, call2 is 2–5)
    // * call3 overlap 7–9 on vehicle2 = 120
    // Total = 180
    const expected = 180;

    // Print result and pass/fail
    console.log(`Result:   ${result} minutes`);
    console.log(`Expected: ${expected} minutes`);
    console.log(`Status:   ${result === expected ? 'PASS' : 'FAIL'}`);
}

// Execute tests
main();