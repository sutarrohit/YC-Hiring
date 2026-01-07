
const testCases = [
    { batch: "Summer 2020", search: "2020", expected: true },
    { batch: "Winter 2020", search: "2020", expected: true },
    { batch: "Summer 2021", search: "2020", expected: false },
    { batch: "Winter 2021", search: "2020", expected: false },
    { batch: "W20", search: "2020", expected: true },
    { batch: "S20", search: "2020", expected: true },
    { batch: "W21", search: "2020", expected: false },
    { batch: "2020", search: "2020", expected: true },
    { batch: "21", search: "2020", expected: false },
    { batch: "IK12", search: "2020", expected: false },
    { batch: "Summer 24", search: "24", expected: true },
    { batch: "W24", search: "24", expected: true },
    { batch: "Summer 2024", search: "2024", expected: true },
    { batch: "Summer 2024", search: "24", expected: true },
];

function proposedFilter(batch, filterYear) {
    batch = (batch || "").toLowerCase();
    if (!filterYear) return true;
    filterYear = filterYear.toLowerCase();
    
    // If user enters 4 digits like "2020"
    if (/^\d{4}$/.test(filterYear)) {
        const shortYear = filterYear.substring(2);
        return batch.includes(filterYear) || 
               batch.includes(`w${shortYear}`) || 
               batch.includes(`s${shortYear}`) ||
               batch.endsWith(` ${shortYear}`) ||
               batch === shortYear;
    }
    
    // If user enters 2 digits or something else
    return batch.includes(filterYear);
}

console.log("Testing proposed filter logic:");
testCases.forEach(tc => {
    const result = proposedFilter(tc.batch, tc.search);
    console.log(`Batch: "${tc.batch}", Search: "${tc.search}" -> Result: ${result} (Expected: ${tc.expected}) ${result === tc.expected ? "✅" : "❌"}`);
});
