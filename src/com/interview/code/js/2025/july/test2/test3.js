// Data structures
class Shift {
    constructor(id, officerId, vehicleId, startTime, endTime) {
        this.id = id;
        this.officerId = officerId;
        this.vehicleId = vehicleId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Dispatch {
    constructor(id, vehicleId, callId, startTime, endTime) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.callId = callId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Call {
    constructor(id, callType) {
        this.id = id;
        this.callType = callType;
    }
}

class PoliceSystem {
    constructor() {
        this.shifts = [];
        this.dispatches = [];
        this.calls = [];
    }

    // Unused here, but handy if you want to pass "HH:MM" strings instead of numbers
    static timeToMinutes(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    }

    addShift(shift) {
        this.shifts.push(shift);
    }

    addDispatch(dispatch) {
        this.dispatches.push(dispatch);
    }

    addCall(call) {
        this.calls.push(call);
    }

    calculateOfficerCallTime(officerId) {
        let totalMinutes = 0;
        const officerShifts = this.shifts.filter(shift => shift.officerId === officerId);

        officerShifts.forEach(shift => {
            const relevantDispatches = this.dispatches.filter(dispatch =>
                dispatch.vehicleId === shift.vehicleId &&
                this.hasTimeOverlap(shift.startTime, shift.endTime, dispatch.startTime, dispatch.endTime)
            );

            relevantDispatches.forEach(dispatch => {
                totalMinutes += this.calculateOverlapMinutes(
                    shift.startTime, shift.endTime,
                    dispatch.startTime, dispatch.endTime
                );
            });
        });

        return totalMinutes;
    }

    hasTimeOverlap(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }

    calculateOverlapMinutes(shiftStart, shiftEnd, callStart, callEnd) {
        const overlapStart = Math.max(shiftStart, callStart);
        const overlapEnd = Math.min(shiftEnd, callEnd);
        return Math.max(0, overlapEnd - overlapStart);
    }
}

// Test implementation
function runTests() {
    const testCases = [
        {
            name: "Example from problem statement",
            setup: () => {
                const system = new PoliceSystem();

                // Add shifts (11:00–15:00 and 06:00–09:00)
                system.addShift(new Shift(1, "officer1", "vehicle1", 660, 900));  // 11:00-15:00
                system.addShift(new Shift(2, "officer1", "vehicle2", 360, 540));  // 06:00-09:00

                // Add dispatches (calls)
                system.addDispatch(new Dispatch(1, "vehicle1", "call1", 540, 720));  //  9:00-12:00
                system.addDispatch(new Dispatch(2, "vehicle2", "call2", 120, 300));  //  2:00-5:00
                system.addDispatch(new Dispatch(3, "vehicle2", "call3", 420, 600));  //  7:00-10:00

                return system;
            },
            expectedOutput: 180
        },
        // You can add more test cases here...
    ];

    testCases.forEach(test => {
        const system = test.setup();
        const result = system.calculateOfficerCallTime("officer1");
        console.log(`Test: ${test.name}`);
        console.log(`Expected: ${test.expectedOutput}, Got: ${result}`);
        console.log(`Status: ${result === test.expectedOutput ? 'PASS' : 'FAIL'}`);
        console.log('---');
    });
}

// Run tests
runTests();

// Example usage:
const system = new PoliceSystem();
system.addShift(new Shift(1, "officer1", "vehicle1", 660, 900));  // 11:00-15:00
system.addShift(new Shift(2, "officer1", "vehicle2", 360, 540));  // 06:00-09:00

system.addDispatch(new Dispatch(1, "vehicle1", "call1", 540, 720));  //  9:00-12:00
system.addDispatch(new Dispatch(2, "vehicle2", "call2", 120, 300));  //  2:00-5:00
system.addDispatch(new Dispatch(3, "vehicle2", "call3", 420, 600));  //  7:00-10:00

const totalMinutes = system.calculateOfficerCallTime("officer1");
console.log(`Total minutes on calls: ${totalMinutes}`);  // 180