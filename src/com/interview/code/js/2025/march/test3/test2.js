'use strict'; // Enable strict mode for safer JavaScript

// Function to calculate area based on shape name and dimensions
function calculateArea(shape, values) {
    return new Promise((resolve, reject) => {
        let area; // Variable to hold calculated area

        switch (shape) {
            case 'square':
                // Square area = side^2 (values[0] is the side)
                area = Math.pow(values[0], 2);
                break;

            case 'rectangle':
                // Rectangle area = length * width (values[0] and values[1])
                area = values[0] * values[1];
                break;

            case 'circle':
                // Circle area = π * r^2 (π ≈ 3.14, values[0] is radius)
                area = 3.14 * Math.pow(values[0], 2);
                break;

            case 'triangle':
                // Triangle area = 0.5 * base * height (values[0] and values[1])
                area = 0.5 * values[0] * values[1];
                break;

            default:
                // Invalid shape, reject promise with [-1]
                reject([-1]);
                return; // Stop further execution
        }

        // Resolve the promise with area rounded to 2 decimal places
        resolve(parseFloat(area.toFixed(2)));
    });
}

// Function to calculate areas for all provided shapes
function getAreas(shapes, valuesArr) {
    // Map each shape to a promise that calculates its area
    let promises = shapes.map((shape, i) => calculateArea(shape, valuesArr[i]));

    // Wait for all promises to resolve
    // If any promise fails (invalid shape), return [-1]
    return Promise.all(promises).catch(() => {
        return [-1];
    });
}


// Valid example
getAreas(["square", "rectangle", "circle", "triangle"], [[2], [3, 4], [5], [2, 4]])
    .then(console.log);  // Output: [4, 12, 78.5, 4]

// Invalid shape example
getAreas(["square", "trapezium", "rectangle"], [[2], [3, 3, 4], [1, 3]])
    .then(console.log);  // Output: [-1]


