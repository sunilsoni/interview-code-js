// Sample data: represents a list of contracts with hierarchical relationships
// Each contract has an ID, ContractID, optional ParentContractID, and some personal info
const contracts = [
    { ID: 1, ContractID: "C-100", ParentContractID: null, FirstName: "Jon", LastName: "D" },
    { ID: 2, ContractID: "C-101", ParentContractID: "C-100", FirstName: "Bow", LastName: "D" },
    { ID: 3, ContractID: "C-102", ParentContractID: "C-100", FirstName: "Lisa", LastName: "D" },
    { ID: 4, ContractID: "C-103", ParentContractID: "C-101", FirstName: "Cory", LastName: "D" },
    { ID: 5, ContractID: "C-104", ParentContractID: null, FirstName: "James", LastName: "N" },
    { ID: 6, ContractID: "C-105", ParentContractID: "C-103", FirstName: "Nick", LastName: "D" }
];

/* ---------------------------------------------------------------------
   Function: getDescendants()
   Purpose:  Find all contracts that descend from a given parent contract.
             This includes children, grandchildren, and so on (recursive).
--------------------------------------------------------------------- */
function getDescendants(data, parentId) {
    const result = []; // holds all descendant contract IDs

    // Inner recursive function to find children of the current parent ID
    function findChildren(pid) {
        // Loop through each contract in the dataset
        data.forEach(c => {
            // If the contract's ParentContractID matches the current parent
            if (c.ParentContractID === pid) {
                // Add this contract’s ID to the result (it’s a child)
                result.push(c.ContractID);
                // Recursively search for any of its children
                findChildren(c.ContractID);
            }
        });
    }

    // Start recursion with the provided parentId
    findChildren(parentId);
    // Return the full list of descendants
    return result;
}

/* ---------------------------------------------------------------------
   Function: getRootParent()
   Purpose:  Find the top-most ancestor of a given contract.
             It climbs up the hierarchy until it finds a contract
             that has no ParentContractID (i.e., a root contract).
--------------------------------------------------------------------- */
function getRootParent(data, contractId) {
    // Find the contract object for the given contract ID
    const current = data.find(c => c.ContractID === contractId);

    // Base case: if no contract found OR it has no parent → it's the root
    if (!current || !current.ParentContractID)
        return current ? current.ContractID : null;

    // Recursive case: move one level up (to the parent)
    return getRootParent(data, current.ParentContractID);
}

/* ---------------------------------------------------------------------
   Function: getFamily()
   Purpose:  Get the complete family (root + all descendants) for
             any given contract, regardless of whether it’s parent
             or child. It always returns the full branch.
--------------------------------------------------------------------- */
function getFamily(data, contractId) {
    // Step 1: find the root ancestor for this contract
    const root = getRootParent(data, contractId);

    // Step 2: if no root found (invalid ID), return empty array
    if (!root) return [];

    // Step 3: collect the root + all descendants of that root
    const family = [root, ...getDescendants(data, root)];

    // Step 4: return the full family contract list
    return family;
}

/* ---------------------------------------------------------------------
   Example usage and output:
   Each call prints all related contracts in the same family tree.
--------------------------------------------------------------------- */

// Starting from C-100 (the root of D family)
console.log("Family of C-100:", getFamily(contracts, "C-100"));
// Expected Output: ["C-100", "C-101", "C-102", "C-103", "C-105"]

// Starting from C-101 (a child), still finds C-100 as the root
console.log("Family of C-101:", getFamily(contracts, "C-101"));
// Expected Output: ["C-100", "C-101", "C-102", "C-103", "C-105"]

// Starting from the deepest node C-105, climbs up to C-100 and lists all
console.log("Family of C-105:", getFamily(contracts, "C-105"));
// Expected Output: ["C-100", "C-101", "C-102", "C-103", "C-105"]
