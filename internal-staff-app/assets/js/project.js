document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

async function fetchData() {
    try {
        // Fetch data from the n8n webhook
        const project_response = await fetch('http://localhost:3000/project-details');
        if (!project_response.ok) {
            throw new Error(`HTTP error! Status: ${project_response.status}`);
        }

        const log_response = await fetch('http://localhost:3000/project-action-logs');
        if (!log_response.ok) {
            throw new Error(`HTTP error! Status: ${log_response.status}`);
        }

        // Parse the JSON response
        const projects = await project_response.json();
        const logs = await log_response.json();
        
        console.log("Response data:", projects);
        console.log("Logs data:", logs);

        if (!projects || projects.length === 0) {
            console.warn("No project data received.");
            return;
        }
        if (!logs || logs.length === 0) {
            console.warn("No project data received.");
            return;
        }

        const latestLogs = getLatestLogs(logs); 
        console.log("Logs data:", latestLogs);

        // Define columns
        const columns = ["Project ID", "Client ID", "Status", "Project Start Date", "Draft Report Due", "Final Report Due", ""];
        const buttonLabel = "Details";
        const project_summary = projects.map(project => {
            // Find the latest log for this project by matching project_id
            const latestLog = latestLogs.find(log => log.project_id === project.project_id);

            return {
                "Project ID": project.project_id,  // Accessing 'project_id' property
                "Client ID": project.client_id,    // Accessing 'client_id' property
                "Status": latestLog ? latestLog.action_type : "No status",  // Safely access 'action_type'
                "Project Start Date": formatDate(new Date(project.project_start_date)),
                "Draft Report Due": formatDate(new Date(project.draft_report_due_date)),
                "Final Report Due": formatDate(new Date(project.final_report_due_date)),
                "Details": `<button onclick="window.location.href='Project_subpage.html?project_id=${project.project_id}'">Details</button>`
            };
        });
        console.log("Logs data:", project_summary);

        // Populate the table with the fetched data
        buildTable(columns, project_summary, "table", buttonLabel);

        // Store the fetched data as originalData
        window.originalData = project_summary;
        window.filteredData = [...project_summary];

        // Initialize the modal and search with the fetched data
        handleModal("filterBtn", "filterModal", "close", "applyFilterBtn", "resetFilterBtn", "table", buttonLabel, columns, window.originalData);
        handleSearch("searchInput", "table", buttonLabel, columns, window.originalData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function formatDate(date) {
const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
const day = date.getDate();

// Format the date as YYYY-MM-DD
return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Function to get the latest log for each project_id
function getLatestLogs(logs) {
    const latestLogs = {};

    logs.forEach(log => {
        // Convert the timestamp to a Date object for comparison
        const timestamp = new Date(log.timestamp);

        // If the project_id isn't in latestLogs or the current log's timestamp is later, update the latest log
        if (!latestLogs[log.project_id] || timestamp > new Date(latestLogs[log.project_id].timestamp)) {
            latestLogs[log.project_id] = log;
        }
    });

    // Function to format the action_type (Status)
    const formatStatus = (status) => {
        if (!status) return "No status";
        return status
            .replace(/_/g, ' ')  // Replace underscores with spaces
            .toLowerCase()        // Convert all to lowercase
            .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize the first letter of each word
    };

    // Return an array of the latest logs for each project_id with formatted status
    return Object.values(latestLogs).map(log => ({
        ...log,
        action_type: formatStatus(log.action_type) // Format the action_type here
    }));
}