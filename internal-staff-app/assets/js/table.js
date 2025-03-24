function buildTable(columns, data, tableId, buttonLabel) {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    console.log("build table");

    // Create table header
    tableHead.innerHTML = `<tr>${columns.map(col => `<th class='cell'>${col}</th>`).join('')}</tr>`;

    // Create table rows
    tableBody.innerHTML = data.map((row, index) => {
        return `<tr class='table-row'>
            ${columns.slice(0, -1).map(col => `<td class='cell'>${row[col] || ""}</td>`).join('')}
            <td class='cell'>
                <button class='custom-button' data-index="${index}">${buttonLabel}</button>
            </td>
        </tr>`;
    }).join('');

    // Add event listeners to each 'Details' button
    const buttons = tableBody.querySelectorAll('.custom-button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.getAttribute('data-index');
            const projectId = data[index]["Project ID"];
            window.location.href = `Project_subpage.html?project_id=${projectId}`;
        });
    });
}


// Function to handle redirect to project subpage with the project_id
function viewDetails(projectId) {
    window.location.href = `Project_subpage.html?project_id=${projectId}`;
}




function handleModal(filterBtnId, modalId, closeModalId, applyFilterBtnId, resetFilterBtnId, tableId, buttonLabel, columns, originalData) {
    const modal = document.getElementById(modalId);

    document.getElementById(filterBtnId).addEventListener("click", () => {
        modal.style.display = "block";
    });

    document.querySelector('.close').addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.getElementById(applyFilterBtnId).addEventListener("click", () => {
        const column = document.getElementById("columnSelect").value;
        const query = document.getElementById("filterInput").value.toLowerCase();

        let filteredData = originalData.filter(row =>
            row[column] && String(row[column]).toLowerCase().includes(query)
        );

        buildTable(columns, filteredData, tableId, buttonLabel);
        modal.style.display = "none";
    });

    document.getElementById(resetFilterBtnId).addEventListener("click", () => {
        document.getElementById("filterInput").value = "";
        buildTable(columns, originalData, tableId, buttonLabel);
        modal.style.display = "none";
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
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
