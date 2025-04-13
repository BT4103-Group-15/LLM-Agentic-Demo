

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

    function generateSOWPDF(data) {
        const { jsPDF } = window.jspdf;
    
        const doc = new jsPDF();
        doc.setFontSize(12);
    
        let yPosition = 10; // Initial Y position
    
        // Helper function to handle page breaks
        function checkPageBreak() {
            if (doc.internal.pageSize.height - yPosition < 20) {
            doc.addPage();
            yPosition = 10; // Reset Y position after page break
            }
        }
    
        function addText(text) {
            doc.text(text, 14, yPosition);
            yPosition += 10; // Increment Y position after adding text
            checkPageBreak(); // Check for page break
        }
    
        addText('## Scope of Work (SOW)');
        addText('## Security Assessment Services for ' + data.application_name);
        addText("")
        
        addText('###1. **Project Overview**');
    
        addText('This Scope of Work (SOW) outlines the objectives, deliverables, and timelines for the security');
        addText('assessment services to be provided by [Company Name] (hereafter referred to as "The Service');
        addText('Provider"). The purpose of this engagement is to evaluate the security posture of');
        addText(data.application_name + ", identify vulnerabilities, and provide recommendations");
        addText('for mitigation. The testing environment will be the '+ data.testing_environment.join(', ').toLowerCase() );
        addText('located at ' + data.production_url + ".");
        addText("")
        
        addText('### 2. **Objectives**');
    
        addText('The primary objective of this engagement is to conduct a comprehensive security assessment of');
        addText(data.application_name + ' to:');
    
        addText('- Identify vulnerabilities within the web application and API.');
        addText('- Evaluate the effectiveness of authentication and access control mechanisms.');
        addText('- Assess data processing and storage practices.');
        addText('- Simulate real-world attacks to evaluate the security response mechanisms in place.');
        addText('- Provide a comprehensive report of findings with actionable recommendations.');
        addText("")
    
        addText('3. Scope of Services');
    
        addText('#### 3.1 **Security Assessment Areas**');
        addText('The security assessment will cover the following areas:');
        addText('- **Authentication & Access Control**: Evaluation of username/password, SSO, user roles, and')
        addText('session management.');
        addText('- **Input Processing**: Assessment of input fields for potential injection attacks.');
        addText('- **Data Processing**: Review of sensitive data handling, storage, and compliance with regulations.');
        addText('- **API Security**: Testing of API endpoints for vulnerabilities and security controls.');
        addText('- **Infrastructure Security**: Evaluation of security controls and hosting environment.');
        addText("")
    
        addText('#### 3.2 **Testing Methodology**');
        addText('- The security assessment will follow industry best practices, including OWASP, NIST, and PTES');
        addText('frameworks.');
        addText('- Tools such as OWASP ZAP, Burp Suite, and custom scripts will be used to conduct the tests.');
        addText('- The engagement will be divided into the following phases:');
        addText('1. **Planning**: Define the scope and objectives of the assessment.');
        addText('2. **Reconnaissance**: Gather information on the target systems and applications.');
        addText('3. **Vulnerability Assessment**: Identify potential vulnerabilities using automated tools and manual');
        addText('testing.');
        addText('4. **Exploitation**: Attempt to exploit vulnerabilities to determine their severity.');
        addText('5. **Reporting**: Provide detailed findings and remediation recommendations.');
        addText("")
    
        addText('#### 3.3 **Exclusions**');
        addText('The following activities are excluded from the scope:');
    
        addText("- Testing of third-party systems or services not under the client's control.");
        addText('- Denial of Service (DoS) or Distributed Denial of Service (DDoS) attacks.');
        addText('- Physical security assessments.');
        addText('- Social engineering tests beyond the scope defined in the planning phase.');
        addText("")
    
        addText('### 4. **Deliverables**');
        addText('The following deliverables will be provided at the conclusion of the engagement:');
        
        addText('- Executive Summary: A high-level overview of the findings for non-technical stakeholders.');
        addText('- Technical Details: A detailed report outlining identified vulnerabilities, potential impacts, and');
        addText('recommended remediation actions.');
        addText('- Remediation Plan: A prioritized list of vulnerabilities with steps to mitigate them.');
        addText('- Risk Rating: A classification of vulnerabilities based on their severity and potential impact.');
        addText("")
    
        addText('### 5. **Timeline and Milestones**');
    
        addText('| Phase | Start Date | End Date | Duration |');
        addText('|----------------------------|---------------|---------------|------------|');
        addText('| Project Kickoff | ' + data.project_start_date + ' | ' + data.project_start_date + ' | 1 Day |');
        addText('| Reconnaissance & Scanning | [Start Date] | [End Date] | [X days] |');
        addText('| Vulnerability Assessment | [Start Date] | [End Date] | [X days] |');
        addText('| Exploitation & Analysis | [Start Date] | [End Date] | [X days] |');
        addText('| Draft Reporting | ' + data.draft_report_due_date + ' | [End Date] | [X days] |');
        addText('| Reporting & Review | '+ data.final_report_due_date + ' | [End Date] | [X days] |');
        addText('| Final Review & Delivery | [Start Date] | [End Date] | 1 Day |');
        addText("")
    
        addText('### 6. **Roles and Responsibilities**');
    
        addText('#### 6.1 **Client Responsibilities**');
    
        addText('- Provide necessary access to the ' + data.testing_environment.join(', ').toLowerCase() + ' and relevant documentation.');
        addText('- Ensure all systems are properly backed up before testing begins.');
        addText('- Designate a point of contact for coordination throughout the engagement.');
        addText("")
    
        addText('#### 6.2 **Service Provider Responsibilities**');
    
        addText('- Perform the security assessment according to the outlined scope and best practices.');
        addText('- Maintain confidentiality and adhere to non-disclosure agreements (NDAs).');
        addText('- Provide a detailed report of findings within the agreed timeline.');
        addText("")
    
        addText('### 7. **Confidentiality and Data Security**');
    
        addText('- All data and information gathered during the engagement will be treated as confidential.');
        addText('- The Service Provider will not disclose any client information without prior written consent, except as');
        addText('required by law.');
        addText('- The Service Provider will take reasonable steps to secure client data during the testing process.');
        addText("")
    
        addText('### 8. **Pricing and Payment Terms**');
    
        addText('The total cost for the security assessment services is [Total Price], broken down as follows:');
    
        addText('- Initial deposit: [Deposit Amount]');
        addText('- Remaining balance: [Balance Amount]');
        addText('- Payment is due upon receipt of the final report.');
        addText("")
    
        addText('### 9. **Acceptance**');
    
        addText('By signing below, both parties acknowledge and accept the terms outlined in this Scope of Work.');
        addText("")
    
        // Signature section
        addText('**Client Name**: ________________________ **Signature**: __________________________');
        addText('**Date**: _______________________________');
        addText('**Service Provider Name**: ________________________ **Signature**:');
        addText('__________________________ **Date**: _______________________________');
        addText('---');
    
        addText('### 10. **Terms and Conditions**');
    
        addText('- The engagement will follow the agreed-upon schedule and timelines.');
        addText('- Any changes or additions to the scope of work may result in additional costs or timeline');
        addText('adjustments.');
        addText('- Either party may terminate this agreement with [Number of Days] notice.');
    
        // Save the PDF
        doc.save('Security_Assessment_SOW.pdf');
    }
});



// Back button functionality
document.getElementById("back-button").addEventListener("click", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    window.location.href = 'Project_subpage.html?project_id=' + projectId;
});
