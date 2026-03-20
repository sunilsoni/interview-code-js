const data = [
    { name: "c", age: 23 },
    { name: "b", age: 22 },
    { name: "d", age: 21 },
    { name: "e", age: 21 },
    { name: "f", age: 22 }
];

const result = data.reduce((acc, { age }) => {
    acc[age] = (acc[age] || 0) + 1;
    return acc;
}, {});

console.log(result);