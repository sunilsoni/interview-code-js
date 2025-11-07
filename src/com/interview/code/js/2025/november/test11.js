const contracts = [
    { ID: 1, ContractID: "C-100", ParentContractID: null, FirstName: "Jon", LastName: "D" },
    { ID: 2, ContractID: "C-101", ParentContractID: "C-100", FirstName: "Bow", LastName: "D" },
    { ID: 3, ContractID: "C-102", ParentContractID: "C-100", FirstName: "Lisa", LastName: "D" },
    { ID: 4, ContractID: "C-103", ParentContractID: "C-101", FirstName: "Cory", LastName: "D" },
    { ID: 5, ContractID: "C-104", ParentContractID: null, FirstName: "James", LastName: "N" },
    { ID: 6, ContractID: "C-105", ParentContractID: "C-103", FirstName: "Nick", LastName: "D" }
];

// find all descendants (children, grandchildren, etc.)
function getDescendants(data, parentId) {
    const result = [];
    function findChildren(pid) {
        data.forEach(c => {
            if (c.ParentContractID === pid) {
                result.push(c.ContractID);
                findChildren(c.ContractID);
            }
        });
    }
    findChildren(parentId);
    return result;
}

// find the top-most ancestor
function getRootParent(data, contractId) {
    const current = data.find(c => c.ContractID === contractId);
    if (!current || !current.ParentContractID) return current ? current.ContractID : null;
    return getRootParent(data, current.ParentContractID);
}

// main function: full family
function getFamily(data, contractId) {
    const root = getRootParent(data, contractId);
    if (!root) return [];
    const family = [root, ...getDescendants(data, root)];
    return family;
}

// Example calls
console.log("Family of C-100:", getFamily(contracts, "C-100"));
// -> ["C-100", "C-101", "C-102", "C-103", "C-105"]

console.log("Family of C-101:", getFamily(contracts, "C-101"));
// -> ["C-100", "C-101", "C-102", "C-103", "C-105"]

console.log("Family of C-105:", getFamily(contracts, "C-105"));
// -> ["C-100", "C-101", "C-102", "C-103", "C-105"]
