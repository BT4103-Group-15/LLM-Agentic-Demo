// Function to manage the button changes based on the current process
function updateButtons(currentProcess) {
    const rows = document.querySelectorAll('.file-row');
    let changeToUpload = false; // Track when we should change to "Upload File"

    rows.forEach(row => {
        const process = row.getAttribute('data-process');
        const uploadButton = row.querySelector('td button');
        const reuploadButton = row.querySelector('td button.reupload');

        if (process === currentProcess) {
            // For the current process, use "Upload File" and no "Reupload"
            uploadButton.innerText = 'Upload File';
            reuploadButton.style.display = 'none';
            changeToUpload = true; // Start changing subsequent files
        } else if (changeToUpload) {
            // For all subsequent rows, show "Upload File" and no "Reupload"
            uploadButton.innerText = 'Upload File';
            reuploadButton.style.display = 'none';
        } else {
            // For previous rows, show "Download File" and "Reupload"
            uploadButton.innerText = 'Download File';
            reuploadButton.style.display = 'inline-block';
        }
    });
}

// Example: Set the current process to "Technical Assessment"
updateButtons('Technical Assessment');
