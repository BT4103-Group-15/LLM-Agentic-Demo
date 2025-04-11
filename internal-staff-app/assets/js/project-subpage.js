document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');

    if (projectId) {
        // Fetch the project data for the given project_id (from local storage or API)
        fetchProjectData(projectId);
    }
    
    // Add event listener for the "Logs" button
    const logsButton = document.getElementById('logs-button');
    logsButton.addEventListener('click', () => {
        // Fetch logs when the button is clicked
        fetchLogs();
    });

    // Add event listener for the "Logs" button
    const chatButton = document.getElementById('chat-button');
    chatButton.addEventListener('click', () => {
        // Fetch logs when the button is clicked
        fetchChatHistory();
    });
});

document.getElementById("file-upload-button").addEventListener("click", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    window.location.href = 'file_upload_download.html?project_id=' + projectId;
});



async function fetchProjectData(projectId) {
    try {
        // Assuming you already have the project data (either from the previous page or from an API)
        const project_response = await fetch('http://localhost:3000/project-details');
        const logs_response = await fetch('http://localhost:3000/project-action-logs');
        if (!project_response.ok || !logs_response.ok) {
            throw new Error("Error fetching project or log data");
        }

        const projects = await project_response.json();
        const logs = await logs_response.json();

        console.log(projects)
        console.log(logs)
        console.log(projectId)

        // Find the project data for the given project_id
        const project = projects.find(p => p.project_id === parseInt(projectId));      
        const logsForProject = logs.filter(l => l.project_id === parseInt(projectId));
        let latestLog = null;
        if (logsForProject.length > 0) {
            // Sort the logs by timestamp in descending order (latest first)
            logsForProject.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Get the latest log (the first one in the sorted array)
            latestLog = logsForProject[0];

            // Log the latest log for debugging
            console.log("Latest Log:", latestLog);

        } else {
            console.error("No logs found for the given project_id");
        }


        console.log(project)
        console.log(latestLog)
        
        // Fill in project details
        if (project && logsForProject) {
            document.getElementById("project-name").innerText = project.project_id || "N/A";
            document.getElementById("client-id").innerText = project.client_id || "N/A";
            document.getElementById("status").innerText = latestLog.action_type ? formatStatus(latestLog.action_type) : "No status";
            document.getElementById("application-name").innerText = project.application_name || "N/A";
            document.getElementById("application-type").innerText = project.application_type  || "N/A";
            document.getElementById("production-url").innerText = project.production_url  || "N/A";

            document.getElementById("authentication-method").innerText = project.authentication_method || "N/A";
            document.getElementById("user-roles").innerText = project.user_roles || "N/A";
            document.getElementById("session-management").innerText = project.session_management || "N/A";
            document.getElementById("authentication-required").innerText = project.authentication_required || "N/A";
            document.getElementById("security-controls-present").innerText = project.security_controls_present || "N/A";

            document.getElementById("testing-environment").innerText = project.testing_environment || "N/A";
            document.getElementById("hosting").innerText = project.hosting || "N/A";
            document.getElementById("data-storage").innerText = project.data_storage || "N/A";
            document.getElementById("compliance-requirements").innerText = project.compliance_requirements || "N/A";

            document.getElementById("total-num-input-fields").innerText = project.total_num_input_fields || "N/A";
            document.getElementById("input-types-present").innerText = project.input_types_present || "N/A";
            document.getElementById("sensitive-data-handled").innerText = project.sensitive_data_handled || "N/A";

            document.getElementById("session-timeout-period").innerText = project.session_timeout_period || "N/A";
            document.getElementById("time-restrictions").innerText = project.time_restrictions || "N/A";
            document.getElementById("testing-limitations").innerText = project.testing_limitations || "N/A";

            document.getElementById("project-start-date").innerText = formatDate(project.project_start_date) || "N/A";
            document.getElementById("draft-report-due-date").innerText = formatDate(project.draft_report_due_date) || "N/A";
            document.getElementById("final-report-due-date").innerText = formatDate(project.final_report_due_date) || "N/A";
            document.getElementById("previous-testing").innerText = formatDate(project.previous_testing) || "N/A";

            document.getElementById("number-of-endpoints").innerText = project.number_of_endpoints || "N/A";
            document.getElementById("rate-limiting").innerText = project.rate_limiting || "N/A";
            document.getElementById("documentation-available").innerText = project.documentation_available || "N/A";

            document.getElementById("critical-functions").innerText = project.critical_functions || "N/A";
            document.getElementById("required-reports").innerText = project.required_reports || "N/A";
            document.getElementById("created-at").innerText = formatTimeStamp(project.created_at) || "N/A";
            
            
        } else {
            console.error("Project not found for the given project_id");
        }
        

    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

async function fetchChatHistory() {
    try {
        const logs_response = await fetch('http://localhost:3000/chatbot-logs');
        if (!logs_response.ok) {
            throw new Error("Error fetching logs data");
        }
        

        const logs = await logs_response.json();
        // Assuming you already have project_id available
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project_id');
        
        // Find logs for the given project_id
        const logsForProject = logs.filter(l => l.project_id === parseInt(projectId));
        if (logsForProject) {
            // Download logs as JSON file
            downloadJSON(logsForProject, 'chatbot-log.json');
        } else {
            console.error("Logs not found for the given project_id");
        }

    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

async function fetchLogs() {
    try {
        const logs_response = await fetch('http://localhost:3000/project-action-logs');
        if (!logs_response.ok) {
            throw new Error("Error fetching logs data");
        }

        const logs = await logs_response.json();
        // Assuming you already have project_id available
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project_id');
        
        // Find logs for the given project_id
        const logsForProject = logs.filter(l => l.project_id === parseInt(projectId));
        if (logsForProject) {
            // Download logs as JSON file
            downloadJSON(logsForProject, 'project-log.json');
        } else {
            console.error("Logs not found for the given project_id");
        }

    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

function downloadJSON(data, filename) {
    // Convert data to a JSON string
    const jsonData = JSON.stringify(data, null, 2);

    // Create a Blob object from the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();  // Programmatically trigger the download
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

function formatStatus(status) {
    if (!status) return "No status";
    return status
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .toLowerCase()        // Convert all to lowercase
        .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize the first letter of each word
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if month is single digit
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
    
    return `${year}-${month}-${day}`; // Format to "YYYY-MM-DD"
}

function formatTimeStamp(dateString) {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits for hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits for minutes
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure two digits for seconds
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}