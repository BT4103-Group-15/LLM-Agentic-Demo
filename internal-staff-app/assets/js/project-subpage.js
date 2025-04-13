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
    // Ensure the input is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
        console.error("Invalid date:", date);
        return null; // Or return a default value
    }

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

document.addEventListener('DOMContentLoaded', function() {
    // Hide the modal by default when the page loads
    document.getElementById('update-popup').style.display = 'none';

    // Show the modal when the "Update Data" button is clicked
    document.getElementById('update-button').addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project_id');
        preFillForm(projectId);
        document.getElementById('update-popup').style.display = 'flex'; // Show modal
    });

    // Close the modal when the "X" button is clicked
    document.getElementById('close-popup').addEventListener('click', function() {
        document.getElementById('update-popup').style.display = 'none'; // Hide modal
    });

    // Close the modal when clicking outside the popup (background click)
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('update-popup')) {
            document.getElementById('update-popup').style.display = 'none'; // Hide modal
        }
    });

    // Event listener for form submission
    document.getElementById('update-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from actually submitting
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('project_id');

        // Collect data from the form inputs
        // Helper function to split if comma is present
    function splitIfComma(value) {
        if (value.includes(',')) {
            return value.split(',');
        }
        return value;
    }
    
    const data = {
        application_name: document.getElementById('application_name').value,
        production_url: document.getElementById('production_url').value,
        testing_environment: splitIfComma(document.getElementById('testing_environment').value),
        application_type: splitIfComma(document.getElementById('application_type').value),
        authentication_method: splitIfComma(document.getElementById('authentication_method').value),
        user_roles: splitIfComma(document.getElementById('user_roles').value),
        session_management: splitIfComma(document.getElementById('session_management').value),
        session_timeout_period: document.getElementById('session_timeout_period').value,
        total_num_input_fields: document.getElementById('total_num_input_fields').value,
        input_types_present: splitIfComma(document.getElementById('input_types_present').value),
        sensitive_data_handled: splitIfComma(document.getElementById('sensitive_data_handled').value),
        data_storage: splitIfComma(document.getElementById('data_storage').value),
        number_of_endpoints: document.getElementById('number_of_endpoints').value,
        authentication_required: document.getElementById('authentication_required').value,
        rate_limiting: document.getElementById('rate_limiting').value,
        documentation_available: document.getElementById('documentation_available').value,
        security_controls_present: splitIfComma(document.getElementById('security_controls_present').value),
        hosting: document.getElementById('hosting1').value,
        critical_functions: splitIfComma(document.getElementById('critical_functions').value),
        compliance_requirements: splitIfComma(document.getElementById('compliance_requirements').value),
        previous_testing: document.getElementById('previous_testing').value,
        time_restrictions: splitIfComma(document.getElementById('time_restrictions').value),
        testing_limitations: splitIfComma(document.getElementById('testing_limitations').value),
        required_reports: splitIfComma(document.getElementById('required_reports').value),
        project_start_date: document.getElementById('project_start_date').value,
        draft_report_due_date: document.getElementById('draft_report_due_date').value,
        final_report_due_date: document.getElementById('final_report_due_date').value,
    };
        console.log(data)

        // Log the JSON to the console (or send it somewhere)
        cleanJsonData(data, projectId);
        // window.location.reload();
        
    });
});

function cleanJsonData(jsonData, projectId) {                
                try {

                    // Convert JSON arrays to JSON strings for SQL insertion
                    const jsonFields = [
                        "testing_environment",
                        "application_type",
                        "authentication_method",
                        "user_roles",
                        "session_management",
                        "input_types_present",
                        "sensitive_data_handled",
                        "data_storage",
                        "security_controls_present",
                        "hosting",
                        "critical_functions",
                        "compliance_requirements",
                        "time_restrictions",
                        "testing_limitations",
                        "required_reports"
                    ];

                    jsonFields.forEach(field => {
                        let value = jsonData[field];
                        
                        if (Array.isArray(value)) {
                            // Already an array, stringify directly
                            jsonData[field] = JSON.stringify(value);
                        } 
                        else if (typeof value === 'string') {
                            // If it's a string that looks like a list (comma-separated), convert to array and stringify
                            if (value.includes(',')) {
                                jsonData[field] = JSON.stringify(value.split(',').map(item => item.trim()));
                            } 
                            else if (value.trim() !== '') {
                                // If it's a single value string, wrap into an array and stringify
                                jsonData[field] = JSON.stringify([value.trim()]);
                            } 
                            else {
                                // If empty string, store as empty JSON array
                                jsonData[field] = JSON.stringify([]);
                            }
                        } 
                        else {
                            // If undefined or null, store as empty JSON array
                            jsonData[field] = JSON.stringify([]);
                        }
                        console.log(value)
                    });


                    console.log("Cleaned Data:", jsonData);

                    // After cleaning, re-upload the file or send the data
                    uploadFile(jsonData, projectId);


                } catch (error) {
                    console.error("Error reading or parsing JSON file:", error);
                    alert("Error reading or parsing JSON file");
                }
};

function uploadFile(file, projectId) {
            const formData = new FormData();

            // Construct the URL
            const uploadApiUrl = `http://localhost:3000/project-details/${projectId}`;
            const n8nURL = `http://localhost:5678/webhook-test/3aa217cb-cf2f-4a34-b65e-10d2b68b6c2b`;
            console.log('Uploading file and data to URL:', uploadApiUrl);

            fetch(n8nURL, {
                method: 'PUT',
                body: JSON.stringify({
                    id: projectId, // Send the id here
                    file: file // Send the file data here
                }),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response from server:', data);
                alert("Successfully updated!");  // Show popup on success
            })
            .catch(error => {
                console.error('Error uploading file and data:', error);
                alert("Update failed. Please try again.");  // Show error popup
            });


            // Send the request
            fetch(uploadApiUrl, {
                method: 'PUT',
                body: JSON.stringify(file),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response from server:', data);
                alert("Successfully updated!");  // Show popup on success
            })
            .catch(error => {
                console.error('Error uploading file and data:', error);
                alert("Update failed. Please try again.");  // Show error popup
            });
        }


function splitIfComma(value) {
if (value.includes(',')) {
    return value.split(',');
}
return value;
}

// Function to pre-fill the form fields
async function preFillForm(project_id) {
    const project_response = await fetch(`http://localhost:3000/project-details/${project_id}`);

    if (!project_response.ok) {
        throw new Error("Failed to fetch project details");
    }

    // Parse the JSON response
    const project_data = await project_response.json();

    document.getElementById('application_name').value = project_data.application_name; // Project name from project_data
    document.getElementById('production_url').value = project_data.production_url; // Production URL from project_data
    document.getElementById('testing_environment').value = project_data.testing_environment; // Testing environment from project_data
    document.getElementById('application_type').value = project_data.application_type; // Application type from project_data
    document.getElementById('authentication_method').value = project_data.authentication_method; // Authentication method from project_data
    document.getElementById('user_roles').value = project_data.user_roles; // User roles from project_data
    document.getElementById('session_management').value = project_data.session_management; // Session management from project_data
    document.getElementById('session_timeout_period').value = project_data.session_timeout_period; // Session timeout period from project_data
    document.getElementById('total_num_input_fields').value = project_data.total_num_input_fields; // Number of input fields from project_data
    document.getElementById('input_types_present').value = project_data.input_types_present; // Input types from project_data
    document.getElementById('sensitive_data_handled').value = project_data.sensitive_data_handled; // Sensitive data handling from project_data
    document.getElementById('data_storage').value = project_data.data_storage; // Data storage from project_data
    document.getElementById('number_of_endpoints').value = project_data.number_of_endpoints; // Number of endpoints from project_data
    document.getElementById('authentication_required').value = project_data.authentication_required; // Authentication required from project_data
    document.getElementById('rate_limiting').value = project_data.rate_limiting; // Rate limiting from project_data
    document.getElementById('documentation_available').value = project_data.documentation_available; // Documentation availability from project_data
    document.getElementById('security_controls_present').value = project_data.security_controls_present; // Security controls from project_data
    document.getElementById('hosting1').value = project_data.hosting; // Hosting platforms from project_data
    document.getElementById('critical_functions').value = project_data.critical_functions; // Critical functions from project_data
    document.getElementById('compliance_requirements').value = project_data.compliance_requirements; // Compliance requirements from project_data
    document.getElementById('previous_testing').value = formatDate(project_data.previous_testing); // Previous testing date from project_data
    document.getElementById('time_restrictions').value = project_data.time_restrictions; // Time restrictions from project_data
    document.getElementById('testing_limitations').value = project_data.testing_limitations; // Testing limitations from project_data
    document.getElementById('required_reports').value = project_data.required_reports; // Required reports from project_data
    document.getElementById('project_start_date').value = formatDate(project_data.project_start_date); // Project start date from project_data
    document.getElementById('draft_report_due_date').value = formatDate(project_data.draft_report_due_date); // Draft report due date from project_data
    document.getElementById('final_report_due_date').value = formatDate(project_data.final_report_due_date); // Final report due date from project_data
}




