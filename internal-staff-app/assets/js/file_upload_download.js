
document.addEventListener("DOMContentLoaded", function () {
    const reqButton = document.getElementById("req-download");
    const sowButton = document.getElementById("sow-upload");

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    


    // When download button is clicked
    reqButton.addEventListener("click", async function () {
        console.log("PDF download clicked");
        handleDownload("http://localhost:3000/project-details/" + projectId, 'scoping');
    });
    sowButton.addEventListener("click", async function () {
        console.log("PDF download clicked");
        handleDownload("http://localhost:3000/project-details/" + projectId, 'sow');
    });

    // Function to handle download for both PDF and JSON
    async function handleDownload(apiUrl, type) {
        try {
            const response = await fetch(apiUrl);

            if (response.ok) {
                const data = await response.json();

                if (data && typeof data === 'object') {
                    
                    // Choose which function to call
                    if (type === 'scoping') {
                        generateScopingPDF(data);
                    } else if (type === 'sow') {
                        generateSOWPDF(data);
                    }
                    
                } else {
                    console.error("Unexpected response structure");
                    alert("Failed to process data. Unexpected structure.");
                }
            } else {
                console.error("Fetch failed with status:", response.status);
                alert("Failed to download data.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching the data.");
        }
    } 


    // PDF generation function
    function generateScopingPDF(jsonData) {
        // Create a new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title for the PDF
        doc.text("Project Information", 20, 20);

        // Set table columns
        const headers = ['Field', 'Value'];
        const rows = [];

        // Iterate through the JSON and format as rows for the table
        Object.keys(jsonData).forEach(key => {
            let value = jsonData[key];

            // If the value is an array, join the elements into a string
            if (Array.isArray(value)) {
                value = value.join(', ');
            }

            // Convert any value to a string before adding to the table
            value = String(value);

            // Add the row to the table
            rows.push([key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), value]);
        });

        // Add the table to the PDF using autoTable
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 30, // Starting position for the table
            theme: 'striped', // Optional: adds some styling to the table
        });

        // Save the generated PDF
        doc.save('project_information_table.pdf');
    }

    async function generateSOWPDF(data) {
        try {
            const response = await fetch("http://localhost:5678/webhook-test/e16c6e2f-f583-4b54-ab7d-ba7e1859eb26", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "pdf",
                    project_id: projectId,
                    file: "sow"
                })
            });

            // Check if the response is okay (status 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseData = await response.json();  // Parse the JSON body from the response
            console.log(responseData[0]);  // Log the first item in the response array
    
            let sowsheetMarkdown = responseData[0].sowsheet_markdown;  // Access the markdown field
            console.log("SOW Sheet Markdown:", sowsheetMarkdown);
            
            // Use jsPDF to create the PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

             // Set the font to Helvetica (default font in jsPDF)
        doc.setFont("helvetica", "normal");

        // Define some variables to manage text overflow and page breaks
        const margin = 10;
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 10;  // Adjust line height if needed
        const pageWidth = doc.internal.pageSize.width;
        let yPosition = margin;  // Start at the top of the page

        // Split the markdown content into an array of lines
        let lines = doc.splitTextToSize(sowsheetMarkdown, pageWidth - 2 * margin);

        // Loop through the lines, adding them to the PDF and handling page breaks
        for (let i = 0; i < lines.length; i++) {
            if (yPosition + lineHeight > pageHeight - margin) {
                // If the text exceeds the page height, create a new page
                doc.addPage();
                yPosition = margin;  // Reset yPosition to top of the new page
            }

            // Add the current line to the PDF
            doc.text(lines[i], margin, yPosition);
            yPosition += lineHeight;  // Move the yPosition down for the next line
        }

            // Save the PDF (this is optional, you can modify it to return or do something else)
            doc.save("SOW_Sheet.pdf");

            // Return the generated PDF document object (or any desired output)
            return doc;
            
    
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }
    
});



// Back button functionality
document.getElementById("back-button").addEventListener("click", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    window.location.href = 'Project_subpage.html?project_id=' + projectId;
});
