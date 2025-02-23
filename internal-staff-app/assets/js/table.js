// common.js
function buildTable(columns, data, tableId, buttonLabel) {
    const tableHead = document.querySelector(`#${tableId}Head`);
    const tableBody = document.querySelector(`#${tableId}Body`);

    // Create table header
    tableHead.innerHTML = columns.map(col => `<th class='cell'>${col}</th>`).join('');

    // Create table rows
    tableBody.innerHTML = data.map(row => {
        return `<tr class='table-row'>
            ${columns.slice(0, -1).map(col => `<td class='cell'>${row[col]}</td>`).join('')}
            <td class='cell'>
                <button class='custom-button'>${buttonLabel}</button>
            </td>
        </tr>`;
    }).join('');
}


function handleModal(filterBtnId, modalId, closeModalId, applyFilterBtnId, resetFilterBtnId,buttonLabel, tableId, columns, originalData) {
    // Open modal
    document.getElementById(filterBtnId).addEventListener("click", function () {
        document.getElementById(modalId).style.display = "block";
    });

    // Close modal
    document.querySelector('.close').addEventListener("click", function () {
        document.getElementById(modalId).style.display = "none";
    });
       

    // Apply filter
    document.getElementById(applyFilterBtnId).addEventListener("click", function () {
        const column = document.getElementById("columnSelect").value;
        const query = document.getElementById("filterInput").value.toLowerCase();

        let filteredData = originalData.filter(row =>
            String(row[column]).toLowerCase().includes(query)
        );

        buildTable(columns, filteredData, tableId, buttonLabel);
        document.getElementById(modalId).style.display = "none"; // Close the modal
    });

    // Reset filter
    document.getElementById(resetFilterBtnId).addEventListener("click", function () {
        document.getElementById("filterInput").value = ""; // Clear the input field
        buildTable(columns, originalData, tableId, buttonLabel); // Rebuild the table with original data
        document.getElementById(modalId).style.display = "none"; // Close the modal
    });

    // Close modal if clicked outside
    window.onclick = function (event) {
        if (event.target === document.getElementById(modalId)) {
            document.getElementById(modalId).style.display = "none";
        }
    };
}

function handleSearch(searchInputId, tableId, buttonLabel, columns, originalData) {
    document.getElementById(searchInputId).addEventListener("input", function () {
        const searchQuery = document.getElementById(searchInputId).value.toLowerCase();

        let filteredData = originalData.filter(row =>
            columns.some(col => String(row[col]).toLowerCase().includes(searchQuery))
        );

        buildTable(columns, filteredData, tableId, buttonLabel);
    });
}
